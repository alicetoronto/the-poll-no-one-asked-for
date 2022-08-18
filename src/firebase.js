// Importing the required functions from the SDKs
import {initializeApp} from "firebase/app";

// App's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDc2hwd5xnOmX_8Hlc814cfGhENquE-9jI",
    authDomain: "project-3-59f7e.firebaseapp.com",
    databaseURL: "https://project-3-59f7e-default-rtdb.firebaseio.com",
    projectId: "project-3-59f7e",
    storageBucket: "project-3-59f7e.appspot.com",
    messagingSenderId: "1068641933999",
    appId: "1:1068641933999:web:5e71dcb91d674429cd925a"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;