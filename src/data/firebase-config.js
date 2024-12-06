import { initializeApp  } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBn_sNe6UfJzZVQkZWTC-zSl1eoy78g0XE",
    authDomain: "bancopowerbi.firebaseapp.com",
    databaseURL: "https://bancopowerbi-default-rtdb.firebaseio.com",
    projectId: "bancopowerbi",
    storageBucket: "bancopowerbi.appspot.com",
    messagingSenderId: "630219075006",
    appId: "1:630219075006:web:9a0acd2446d0c5b8145def",
    measurementId: "G-072KHB9PGE"
  };
  
  // Inicializando o Firebase
  const app=initializeApp(firebaseConfig);
  
 export const auth=getAuth(app);
 export const db = getFirestore(app); 
 