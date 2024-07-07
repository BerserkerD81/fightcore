// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Asegúrate de importar el método getDatabase


// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAnDsNSIAfUkj3weaw2ID40wT-LQ7JinJY",
  authDomain: "fightcorefgc.firebaseapp.com",
  projectId: "fightcorefgc",
  storageBucket: "fightcorefgc.appspot.com",
  messagingSenderId: "633866961609",
  appId: "1:633866961609:web:a2ad659b5551e129a58318"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database }; // 