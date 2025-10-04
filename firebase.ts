// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_ho86XCmSLv8e57kEKlM5UFax9C9bxtY",
  authDomain: "feng-shui-window-calculator.firebaseapp.com",
  projectId: "feng-shui-window-calculator",
  storageBucket: "feng-shui-window-calculator.firebasestorage.app",
  messagingSenderId: "463086639273",
  appId: "1:463086639273:web:cde2c84508fd6fff4df1b8",
  measurementId: "G-KC4X2V3GKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
