"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRole = exports.createUser = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
// Initialize Admin SDK once per instance
if (!admin.apps.length) {
    admin.initializeApp();
}
// Helper: require caller to be Admin via custom claims
const requireAdmin = async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'You must be signed in.');
    }
    const claims = request.auth.token;
    // Allow if custom claim is present
    if (claims.role === 'Admin')
        return;
    // Fallback: check Firestore user doc role
    const db = admin.firestore();
    const userDoc = await db.doc(`users/${request.auth.uid}`).get();
    if (userDoc.exists && userDoc.data()?.role === 'Admin')
        return;
    throw new https_1.HttpsError('permission-denied', 'Admin privileges are required.');
};
// Callable function: Admin creates a user; sets claim and Firestore doc
exports.createUser = (0, https_1.onCall)(async (request) => {
    await requireAdmin(request);
    const { email, password, role } = (request.data || {});
    if (!email || !password || !role) {
        throw new https_1.HttpsError('invalid-argument', 'email, password, and role are required.');
    }
    if (role !== 'Admin' && role !== 'User') {
        throw new https_1.HttpsError('invalid-argument', 'role must be "Admin" or "User".');
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
    }
    catch (err) {
        if (err?.code === 'auth/email-already-exists') {
            throw new https_1.HttpsError('already-exists', 'This email is already registered.');
        }
        throw new https_1.HttpsError('internal', err?.message || 'Failed to create user');
    }
});
// Callable: setRole (Admin only) to update claims + Firestore doc
exports.setRole = (0, https_1.onCall)(async (request) => {
    await requireAdmin(request);
    const { uid, role } = (request.data || {});
    if (!uid || !role) {
        throw new https_1.HttpsError('invalid-argument', 'uid and role are required.');
    }
    if (role !== 'Admin' && role !== 'User') {
        throw new https_1.HttpsError('invalid-argument', 'role must be "Admin" or "User".');
    }
    try {
        await admin.auth().setCustomUserClaims(uid, { role });
        const db = admin.firestore();
        await db.doc(`users/${uid}`).set({ role }, { merge: true });
        return { uid, role };
    }
    catch (err) {
        throw new https_1.HttpsError('internal', err?.message || 'Failed to set role');
    }
});
//# sourceMappingURL=index.js.map