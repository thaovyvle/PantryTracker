// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAn5rYigcmK5iYDDghac0rQsPsv_nL4ac",
  authDomain: "hspantrytracker-2a984.firebaseapp.com",
  projectId: "hspantrytracker-2a984",
  storageBucket: "hspantrytracker-2a984.appspot.com",
  messagingSenderId: "12999656816",
  appId: "1:12999656816:web:1b3989d363e5f8039cfbb5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}