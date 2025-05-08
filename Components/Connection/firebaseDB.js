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
  //firebase config here
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
