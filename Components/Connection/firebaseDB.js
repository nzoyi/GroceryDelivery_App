import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCA-A-LbSExshqgqtT1xIi7iLFJ8D-gmlU",
  authDomain: "affection-2d245.firebaseapp.com",
  databaseURL:
    "https://affection-2d245-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "affection-2d245",
  storageBucket: "affection-2d245.appspot.com",
  messagingSenderId: "722543280212",
  appId: "1:722543280212:web:3786b1c6836ffdda4cadc1",
  measurementId: "G-HPJB2F0Y0B",
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
