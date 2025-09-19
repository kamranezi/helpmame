import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnBAXiVM7-WhXnqajPbxiHPz977yyVnCk",
  authDomain: "helpmame.firebaseapp.com",
  projectId: "helpmame",
  storageBucket: "helpmame.firebasestorage.app",
  messagingSenderId: "330802462598",
  appId: "1:330802462598:web:89ce1d79ec3d98f24ab607"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export default app;
