//console.log("API Key Fokus360:", import.meta.env.VITE_FOKUS360_FIREBASE_API_KEY);
//console.log("API Key GPS-Tracker:", import.meta.env.VITE_GPSTRACKER_FIREBASE_API_KEY);



import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔹 Configuração do Firebase do Fokus360
const firebaseConfigFokus360 = {
  apiKey: import.meta.env.VITE_FOKUS360_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FOKUS360_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FOKUS360_PROJECTID,
  storageBucket: import.meta.env.VITE_FOKUS360_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FOKUS360_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FOKUS360_APPID,
  databaseURL:import.meta.env.VITE_FOKUS360_DATABASEURL
};

// 🔹 Configuração do Firebase do GPS-Tracker
const firebaseConfigGpsTracker = {
  apiKey: import.meta.env.VITE_GPSTRACKER_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_GPSTRACKER_AUTHDOMAIN,
  projectId: import.meta.env.VITE_GPSTRACKER_PROJECTID,
  storageBucket: import.meta.env.VITE_GPSTRACKER_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_GPSTRACKER_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_GPSTRACKER_APPID,
};

// 🔹 Inicializando os dois Firebase Apps corretamente
const appFokus360 = initializeApp(firebaseConfigFokus360, "Fokus360");
const appGpsTracker = initializeApp(firebaseConfigGpsTracker, "GpsTracker");

// 🔹 Criando as instâncias para Firestore, Auth e Storage
const authFokus360 = getAuth(appFokus360);
const dbFokus360 = getFirestore(appFokus360);
const storageFokus360 = getStorage(appFokus360);

const authGpsTracker = getAuth(appGpsTracker);
const dbGpsTracker = getFirestore(appGpsTracker);
const storageGpsTracker = getStorage(appGpsTracker);


console.log("🌍 API Key do Fokus360:", import.meta.env.VITE_FOKUS360_FIREBASE_API_KEY);
console.log("🌍 API Key do GPS-Tracker:", import.meta.env.VITE_GPSTRACKER_FIREBASE_API_KEY);
console.log("🌍 Conectando ao Firestore do GPS-Tracker:", dbGpsTracker);

// 🔹 Exportando apenas as instâncias necessárias
export { 
  authFokus360, dbFokus360, storageFokus360, 
  authGpsTracker, dbGpsTracker, storageGpsTracker 
};
