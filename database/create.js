import firebase from "firebase/compat/app";
import {} from "firebase/compat/database";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAORF8cH1QIAuYICrYMtgAwb5UCz4OKgxQ",
    authDomain: "webvinyl-4912c.firebaseapp.com",
    databaseURL: "https://webvinyl-4912c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "webvinyl-4912c",
    storageBucket: "webvinyl-4912c.appspot.com",
    messagingSenderId: "1017529934891",
    appId: "1:1017529934891:web:7d3448757b9bc14376b66e",
    measurementId: "G-KDPE4VBBJM"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
export function create() {
    return database;
}