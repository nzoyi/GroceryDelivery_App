import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
//Database Settings Go Here
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
