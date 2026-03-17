import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJdUxiXohXotvXH71GV0AiVsi6fqWdYFI",
  authDomain: "disaster-management-syst-66180.firebaseapp.com",
  projectId: "disaster-management-syst-66180",
  storageBucket: "disaster-management-syst-66180.firebasestorage.app",
  messagingSenderId: "478368461423",
  appId: "1:478368461423:web:7049566577ff508e32d39a"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);