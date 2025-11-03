import app from "firebase/app"
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCXzrgqgfgNBVWbsl0u159HxgYqA9qfeB4",
  authDomain: "proyectointegrador-76350.firebaseapp.com",
  projectId: "proyectointegrador-76350",
  storageBucket: "proyectointegrador-76350.firebasestorage.app",
  messagingSenderId: "467761454051",
  appId: "1:467761454051:web:3c2545263fd70bc90d1ed6"
};

app.initializeApp(firebaseConfig);

export const auth = firebase.auth()
export const storage = app.storage()
export const db = app.firestore()