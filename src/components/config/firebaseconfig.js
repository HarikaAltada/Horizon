import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
    apiKey: "AIzaSyAUYnDBL8AbyskHvGW9x49y6P-ygcOFrLs",
    authDomain: "letter-creation-f918f.firebaseapp.com",
    projectId: "letter-creation-f918f",
    storageBucket: "letter-creation-f918f.firebasestorage.app",
    messagingSenderId: "948050568645",
    appId: "1:948050568645:web:b6817505c2cf69867157ac",
    measurementId: "G-TMC0VVX673"
};

// const app = initializeApp(firebaseConfig);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);