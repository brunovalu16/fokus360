import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Configuração do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_DATABASEURL,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Adicionando Firebase Storage

//console.log("Firebase configurado com sucesso");







{/**
  

  import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCxgL2aHZ4UnQbtrX3saX-Odhh_Q65rs-Y",
  authDomain: "fokus360-4aea3.firebaseapp.com",
  databaseURL: "https://fokus360-4aea3-default-rtdb.firebaseio.com",
  projectId: "fokus360-4aea3",
  storageBucket: "fokus360-4aea3.firebasestorage.app",
  messagingSenderId: "212107223366",
  appId: "1:212107223366:web:d8ea3943ac4d84bf4b4547"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Adicionando Firebase Storage
  
  
  
  */}



