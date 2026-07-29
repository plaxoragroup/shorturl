// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDdKdVBeVPIVPVy0P3UjLcFacw9jMW_tAY",
  authDomain: "gen-lang-client-0683675540.firebaseapp.com",
  databaseURL: "https://gen-lang-client-0683675540-default-rtdb.firebaseio.com",
  projectId: "gen-lang-client-0683675540",
  storageBucket: "gen-lang-client-0683675540.firebasestorage.app",
  messagingSenderId: "737181658528",
  appId: "1:737181658528:web:72a42f7b0b2b5e8ad348c5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
