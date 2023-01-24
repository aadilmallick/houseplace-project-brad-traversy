// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5m3bNnlKuyiOMadRV7cSQGICqsrgV2p4",
  authDomain: "house-marketplace-3f3c5.firebaseapp.com",
  projectId: "house-marketplace-3f3c5",
  storageBucket: "house-marketplace-3f3c5.appspot.com",
  messagingSenderId: "1059950659734",
  appId: "1:1059950659734:web:8dbf28aefadaf084ac9ab7",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();
export { db, storage };
