// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhFk51VCz62u_CqG8u_dSW1hleJDWJHhA",
  authDomain: "iat359-947fb.firebaseapp.com",
  projectId: "iat359-947fb",
  storageBucket: "iat359-947fb.firebasestorage.app",
  messagingSenderId: "880627246481",
  appId: "1:880627246481:web:6bf8e015188b5c29cea630"
};

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);
export const firebase_auth = getAuth(firebase_app);
export const db = getFirestore(firebase_app);