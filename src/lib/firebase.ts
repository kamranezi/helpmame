import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnBAXiVM7-WhXnqajPbxiHPz977yyVnCk",
  authDomain: "helpmame.firebaseapp.com",
  projectId: "helpmame",
  storageBucket: "helpmame.firebasestorage.app",
  messagingSenderId: "330802462598",
  appId: "1:330802462598:web:89ce1d79ec3d98f24ab607"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
