// Importaciones necesarias
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyByoKu258d0ZWzTz4uq_wCvHeuyx8uOvCg",
  authDomain: "dashboard-finance-7690c.firebaseapp.com",
  projectId: "dashboard-finance-7690c",
  storageBucket: "dashboard-finance-7690c.firebasestorage.app",
  messagingSenderId: "1068840783047",
  appId: "1:1068840783047:web:60eccd0717f2898f9e82e2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
