import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAnDsNSIAfUkj3weaw2ID40wT-LQ7JinJY",
    authDomain: "fightcorefgc.firebaseapp.com",
    projectId: "fightcorefgc",
    storageBucket: "fightcorefgc.appspot.com",
    messagingSenderId: "633866961609",
    appId: "1:633866961609:web:e64092765704725ba58318"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)



export { app, auth };