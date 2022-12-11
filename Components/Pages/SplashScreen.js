import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ToastAndroid,
  AlertIOS,
  Text,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native";
import { auth, firebase } from "../Connection/firebaseDB";
// Using DB Reference
import { db } from "../Connection/firebaseDB";

import NetInfo from "@react-native-community/netinfo";

function showToast(msg) {
  if (Platform.OS === "android") {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  } else {
    AlertIOS.alert(msg);
  }
}

const SplashScreen = ({ navigation, route }) => {
  //const netInfo = useNetInfo();

  NetInfo.fetch().then((state) => {
    if (state.isConnected) {
      setTimeout(() => {
        let user = firebase.auth().currentUser;
        if (user) {
          navigation.replace("MainPage");
        } else {
          navigation.replace("Login");
        }
      }, 5000);
    } else {
      showToast("Error No Internet Connection");
    }
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image style={styles.image} source={require("../../assets/icon.png")} />
      <LottieView
        style={styles.Anime}
        source={require("../../assets/loading-lottie.json")}
        autoPlay
        loop={true}
        width={200}
        resizeMode="contian"
        onAnimationFinish={() => {
          console.log("Animation Finished!");
          //this.props.navigation.replace('Login');
        }}
      />
    </View>
  );
};

export default SplashScreen;

export function isConnected() {
  return new Promise((resolve, reject) => {
    NetInfo.fetch().then((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);

      if (state.isConnected) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

const styles = StyleSheet.create({
  Anime: {
    justifyContent: "center",
    width: 200,
    alignItems: "center",
    alignContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    alignContent: "center",
  },
});
