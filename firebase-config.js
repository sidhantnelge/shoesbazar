// Firebase SDK Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmIwdDMLiwjZuJJL3v7GOiisD9wJ2o8kg",
  authDomain: "shoebazar-28bda.firebaseapp.com",
  projectId: "shoebazar-28bda",
  storageBucket: "shoebazar-28bda.firebasestorage.app",
  messagingSenderId: "798261437948",
  appId: "1:798261437948:web:7a57cf09c6f5c224a4fe79",
  measurementId: "G-4WC2ZC616N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
