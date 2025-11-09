// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBhFk51VCz62u_CqG8u_dSW1hleJDWJHhA",
//   authDomain: "iat359-947fb.firebaseapp.com",
//   projectId: "iat359-947fb",
//   storageBucket: "iat359-947fb.firebasestorage.app",
//   messagingSenderId: "880627246481",
//   appId: "1:880627246481:web:6bf8e015188b5c29cea630"
// };

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2z62FSYkVjcjgCg6pbpTcs_ZWSBOQlEk",
  authDomain: "thatapp-812c4.firebaseapp.com",
  projectId: "thatapp-812c4",
  storageBucket: "thatapp-812c4.firebasestorage.app",
  messagingSenderId: "727088196523",
  appId: "1:727088196523:web:034f819f472398615640ee",
  measurementId: "G-FTLPQKZT89"
};

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);
export const firebase_auth = getAuth(firebase_app);
export const db = getFirestore(firebase_app);



