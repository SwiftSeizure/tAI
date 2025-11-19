import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB1-XC70H4aiJ3uw74YkZhJU2--Uk7-lmM",
    authDomain: "capstone-tai.firebaseapp.com",
    projectId: "capstone-tai",
    storageBucket: "capstone-tai.firebasestorage.app",
    messagingSenderId: "700770300559",
    appId: "1:700770300559:web:28267999713e339e75f6fa",
    measurementId: "G-GH6LZB115M"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth instance
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Helper functions for common auth operations
export const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

export const signInWithEmail = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return signOut(auth);
};

// Listen to auth state changes
export const onAuthStateChange = async (callback) => {
  return onAuthStateChanged(auth, callback);
};