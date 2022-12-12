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
import { Dimensions } from "react-native";
import COLORS from "../../Colors/Colors";

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
let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;
const SplashScreen = ({ navigation, route }) => {
  //const netInfo = useNetInfo();

  NetInfo.fetch().then((state) => {
    if (state.isConnected) {
      setTimeout(() => {
        let user = firebase.auth().currentUser;
        if (user) {
          navigation.replace("MainPage");
        } else {
          //navigation.replace("Login");
          navigation.replace("HomePage");
        }
      }, 1000);
    } else {
      showToast("Error No Internet Connection");
    }
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.lightorange,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        resizeMode="cover"
        source={require("../../assets/cityFoods_no_bg.png")}
        style={styles.image}
      />
      <LottieView
        style={styles.Anime}
        source={require("../../assets/shopping.json")}
        autoPlay
        loop={true}
        width={deviceWidth}
        resizeMode="contian"
        onAnimationFinish={() => {
          console.log("Animation Finished!");
          //this.props.navigation.replace('Login');
        }}
      />
      <View style={{ position: "absolute", bottom: 5 }}>
        <Text>Designed & Made Future Designs</Text>
      </View>
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
    alignItems: "center",
    alignContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    bottom: 50,
    alignContent: "center",
  },
});
