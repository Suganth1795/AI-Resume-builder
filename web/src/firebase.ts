import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrNvUWFH15I8ThpOkCX3H1rurwADa0Zx0",
  authDomain: "resume-builder-75597.firebaseapp.com",
  projectId: "resume-builder-75597",
  storageBucket: "resume-builder-75597.firebasestorage.app",
  messagingSenderId: "531343333187",
  appId: "1:531343333187:web:5f3bc66faf80bbcbf7c1f6",
  measurementId: "G-2QWPR8BJW5",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  analytics,
};
