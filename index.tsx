
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LoginPage } from './LoginPage';
import { AppUser, UserRole } from './types';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const RootApp: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // User is signed in, get their role from Firestore.
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: userData?.role as UserRole,
            });
          } else {
            console.error("User document not found in Firestore, logging out.");
            await signOut(auth);
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          await signOut(auth);
          setCurrentUser(null);
        }
      } else {
        // User is signed out.
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(error => console.error("Logout failed:", error));
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-100 text-lg">
        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-slate-700">Authenticating...</span>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  return <App currentUser={currentUser} onLogout={handleLogout} />;
};


const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);