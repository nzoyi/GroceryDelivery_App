/** @format */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { getStorage, ref } from "firebase/storage";

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

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getDatabase(app);
const storage = getStorage(app);
const storageRef = ref;

const app2 = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
export { app2 };
export { auth };
export { db };
export { storage };
export { storageRef };
