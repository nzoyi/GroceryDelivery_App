import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB31BuywNep10Ct9UD-qNKCU40rUf-4rfo",
  authDomain: "cityfoods-70f48.firebaseapp.com",
  databaseURL:
    "https://cityfoods-70f48-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cityfoods-70f48",
  storageBucket: "cityfoods-70f48.appspot.com",
  messagingSenderId: "1025016915176",
  appId: "1:1025016915176:web:7b16f9da8b558cd49ad55d",
  measurementId: "G-HFR5V94S0H",
};

let app;

if (firebase.apps.length == 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const db = app.database();

export { auth };
export { firebase };
export { db };
