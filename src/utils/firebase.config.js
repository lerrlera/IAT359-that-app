// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// AsyncStorage = library for React Native that provides a simple key-value storage solution. 
// option to store data locally.
// suitable for storing lightweight data like strings or JSON objects.
// allows you to persist data in an async manner (it won't block the ui thread.)
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Contains the essential configuration keys (API key, Project ID, etc.) copied from the Firebase console
// This is used to identify and connect to the project.
const firebaseConfig = {
  apiKey: "AIzaSyD2z62FSYkVjcjgCg6pbpTcs_ZWSBOQlEk",
  authDomain: "thatapp-812c4.firebaseapp.com",
  projectId: "thatapp-812c4",
  storageBucket: "thatapp-812c4.firebasestorage.app",
  messagingSenderId: "727088196523",
  appId: "1:727088196523:web:034f819f472398615640ee",
  measurementId: "G-FTLPQKZT89"
};


// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBhFk51VCz62u_CqG8u_dSW1hleJDWJHhA",
//   authDomain: "iat359-947fb.firebaseapp.com",
//   projectId: "iat359-947fb",
//   storageBucket: "iat359-947fb.firebasestorage.app",
//   messagingSenderId: "880627246481",
//   appId: "1:880627246481:web:6bf8e015188b5c29cea630"
// };


// Initialize Firebase app instance using configuration object. 
export const firebase_app = initializeApp(firebaseConfig);

// initialize Firebase authentification service. 
// it uses getReactNativePersistence(AsyncStorage) to ensure
// user's sign-in state is saved & maintained across app sessions. 
export const firebase_auth = initializeAuth(firebase_app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// initialize Firestore cloud db. 
export const db = getFirestore(firebase_app);



