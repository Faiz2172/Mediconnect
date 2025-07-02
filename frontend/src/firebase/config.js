// src/firebase/config.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, PhoneAuthProvider , RecaptchaVerifier } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA38UJiJBRMfbAGl017Q4MjnwSng-wDaEM",
  authDomain: "mediconnect-69ad7.firebaseapp.com",
  projectId: "mediconnect-69ad7",
  storageBucket: "mediconnect-69ad7.firebasestorage.app",
  messagingSenderId: "677064114893",
  appId: "1:677064114893:web:882a57f0a4d1b1da1edf84",
  measurementId: "G-65K7Q8JVBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
const db = getFirestore(app);
const firestore = getFirestore(app);

export const storage = getStorage(app);



export { auth, googleProvider, analytics, db, PhoneAuthProvider , RecaptchaVerifier, firestore };