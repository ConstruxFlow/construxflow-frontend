// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIv234f-d6nWraE9SXo89jDKYe69GtGbE",
  authDomain: "construxflow-ffd5e.firebaseapp.com",
  projectId: "construxflow-ffd5e",
  storageBucket: "construxflow-ffd5e.firebasestorage.app",
  messagingSenderId: "351513220690",
  appId: "1:351513220690:web:95c6af559657acdf53318b",
  measurementId: "G-NEHEFGZH8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};