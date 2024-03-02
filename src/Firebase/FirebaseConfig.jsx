// FirebaseConfig.jsx
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import getAuth
import { collection } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB2IFV7qcdYO4C2-X4_jMmxBldNYS15dfg",
    authDomain: "movie-mingle-4daae.firebaseapp.com",
    projectId: "movie-mingle-4daae",
    storageBucket: "movie-mingle-4daae.appspot.com",
    messagingSenderId: "767550287758",
    appId: "1:767550287758:web:d6e17c4cd06e59409f3edf",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // Correctly export auth
export const movieRef = collection(db, "movies");
export const reviewRef = collection(db, "reviews");
export const userRef = collection(db, "users");

export default app;
