
// Use the modern v9 modular imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the modular services
const db = getFirestore(app);

// Enable offline persistence (safe to ignore failures like multiple tabs)
try {
  enableIndexedDbPersistence(db).catch(() => {
    // Ignored: persistence can fail in private mode or multiple tabs; app continues online-only.
  });
} catch (_) {
  // Non-fatal; Firestore still works without persistence.
}
const auth = getAuth(app);

// Cloud Functions instance (with optional emulator support)
const functions = getFunctions(app);
if (import.meta.env.VITE_EMULATE_FUNCTIONS === 'true') {
  try {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch (_) {
    // Emulator not running; continue with prod functions
  }
}
export { db, auth, functions, app };
