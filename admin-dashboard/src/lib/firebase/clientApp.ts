// ملف تكامل Firebase للعميل
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxqm175vfw9TZP_M_PMjhL8LPhHL0xGRQ",
  authDomain: "application-ebd36.firebaseapp.com",
  projectId: "application-ebd36",
  storageBucket: "application-ebd36.firebasestorage.app",
  messagingSenderId: "981845114569",
  appId: "1:981845114569:web:08a504b2044b612d5ed718",
  measurementId: "G-60TN4J846Z"
};

// For debugging
console.log("🔥 Firebase client initialization starting...");
console.log("Firebase config being used:", {
  apiKey: firebaseConfig.apiKey?.substring(0, 10) + '...',
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket
});

// Initialize Firebase for the client side
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence when possible
if (typeof window !== 'undefined') {
  try {
    enableIndexedDbPersistence(db)
      .then(() => {
        console.log("Firestore persistence has been enabled.");
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
        } else if (err.code === 'unimplemented') {
          console.warn("The current browser doesn't support all of the features required to enable persistence.");
        } else {
          console.error("Error enabling persistence:", err);
        }
      });
  } catch (error) {
    console.error("Error setting up persistence:", error);
  }
}

console.log("🔥 Firebase client initialization complete");
console.log("Auth initialized:", !!auth);
console.log("Firestore initialized:", !!db);
console.log("Storage initialized:", !!storage);

export { app, auth, db, storage }; 