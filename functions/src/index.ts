import * as admin from 'firebase-admin';
import { onCall, CallableRequest, HttpsError } from 'firebase-functions/v2/https';

// Initialize Admin SDK once per instance
if (!admin.apps.length) {
  admin.initializeApp();
}

type UserRole = 'Admin' | 'User';

interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
}

// Helper: require caller to be Admin via custom claims
const requireAdmin = async (request: CallableRequest) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be signed in.');
  }
  const claims = request.auth.token as Record<string, any>;
  // Allow if custom claim is present
  if (claims.role === 'Admin') return;

  // Fallback: check Firestore user doc role
  const db = admin.firestore();
  const userDoc = await db.doc(`users/${request.auth.uid}`).get();
  if (userDoc.exists && userDoc.data()?.role === 'Admin') return;

  throw new HttpsError('permission-denied', 'Admin privileges are required.');
};

// Callable function: Admin creates a user; sets claim and Firestore doc
export const createUser = onCall(async (request) => {
  await requireAdmin(request);

  const { email, password, role } = (request.data || {}) as CreateUserRequest;
  if (!email || !password || !role) {
    throw new HttpsError('invalid-argument', 'email, password, and role are required.');
  }
  if (role !== 'Admin' && role !== 'User') {
    throw new HttpsError('invalid-argument', 'role must be "Admin" or "User".');
  }

  try {
    // Create Auth user
    const userRecord = await admin.auth().createUser({ email, password, emailVerified: false, disabled: false });

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    // Create Firestore user doc
    const db = admin.firestore();
    await db.doc(`users/${userRecord.uid}`).set({
      uid: userRecord.uid,
      email: userRecord.email,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return { uid: userRecord.uid, email: userRecord.email, role };
  } catch (err: any) {
    if (err?.code === 'auth/email-already-exists') {
      throw new HttpsError('already-exists', 'This email is already registered.');
    }
    throw new HttpsError('internal', err?.message || 'Failed to create user');
  }
});

// Callable: setRole (Admin only) to update claims + Firestore doc
export const setRole = onCall(async (request) => {
  await requireAdmin(request);
  const { uid, role } = (request.data || {}) as { uid: string; role: UserRole };
  if (!uid || !role) {
    throw new HttpsError('invalid-argument', 'uid and role are required.');
  }
  if (role !== 'Admin' && role !== 'User') {
    throw new HttpsError('invalid-argument', 'role must be "Admin" or "User".');
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    const db = admin.firestore();
    await db.doc(`users/${uid}`).set({ role }, { merge: true });
    return { uid, role };
  } catch (err: any) {
    throw new HttpsError('internal', err?.message || 'Failed to set role');
  }
});
