// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0M0uyONYtoZtVElmT6psP7ewZ-RotaJ8",
  authDomain: "fish-app-5ff40.firebaseapp.com",
  projectId: "fish-app-5ff40",
  storageBucket: "fish-app-5ff40.appspot.com",
  messagingSenderId: "994303740163",
  appId: "1:994303740163:web:5ad3bebe1f9f3704de4136"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();