// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const FIREBASE_API = import.meta.env.VITE_BASE_FIREBASEAPI;

const firebaseConfig = {
    apiKey: FIREBASE_API,
    authDomain: "school-3b0c3.firebaseapp.com",
    projectId: "school-3b0c3",
    storageBucket: "school-3b0c3.appspot.com",
    messagingSenderId: "698481288075",
    appId: "1:698481288075:web:a653898e266822c076458e",
    measurementId: "G-L5VP1VV8E7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;

