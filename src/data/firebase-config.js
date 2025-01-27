import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBn_sNe6UfJzZVQkZWTC-zSl1eoy78g0XE",
  authDomain: "bancopowerbi.firebaseapp.com",
  databaseURL: "https://bancopowerbi-default-rtdb.firebaseio.com",
  projectId: "bancopowerbi",
  storageBucket: "bancopowerbi.appspot.com",
  messagingSenderId: "630219075006",
  appId: "1:630219075006:web:9a0acd2446d0c5b8145def",
  measurementId: "G-072KHB9PGE",
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



