import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  AppState,
  BackHandler,
  TouchableWithoutFeedback,
} from "react-native";
import Constants from "expo-constants";
import COLORS from "../../Colors/Colors";
import { Image } from "react-native";
import { auth, firebase } from "../Connection/firebaseDB";
// Using DB Reference
import { db } from "../Connection/firebaseDB";

import Icon from "react-native-vector-icons/MaterialIcons";

import {
  useColorScheme,
  ToastAndroid,
  Platform,
  AlertIOS,
  TouchableOpacity,
  Pressable,
  Modal,
} from "react-native";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import { ImageBackground } from "react-native";
import { TextInput } from "react-native";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native";
import { BottomSheet } from "react-native-btr";
import moment from "moment";
import { LogBox } from "react-native";
import * as Location from "expo-location";
import { ActivityIndicator } from "react-native-paper";

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

export default function HomePage({ navigation }) {
  function handleBackButtonClick() {
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  const RemoteImage = ({ uri, desiredWidth }) => {
    const [desiredHeight, setDesiredHeight] = React.useState(0);

    Image.getSize(uri, (width, height) => {
      setDesiredHeight((desiredWidth / width) * height);
    });

    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          resizeMode="cover"
          blurRadius={1}
          source={require("../../assets/bg_orange.jpg")}
          style={{
            borderWidth: 1,
            width: "100%",
            height: "70%",
            alignSelf: "center",
          }}
        />
        <ImageBackground
          source={require("../../assets/img_bg.jpg")}
          borderTopRightRadius={100}
          borderTopLeftRadius={100}
          style={{
            flex: 1,
            padding: 20,
            position: "absolute",
            justifyContent: "center",
            alignSelf: "center",
            bottom: 0,
          }}
        >
          <Text
            style={{
              fontSize: 40,
              fontWeight: "900",
              textAlign: "center",
            }}
          >
            Buy Groceries
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              textAlign: "center",
              opacity: 0.6,
            }}
          >
            Easily With Us
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "300",
              textAlign: "center",
              marginTop: 50,
            }}
          >
            Create an account now and all you desires will be delivered on your
            doorstep
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={{
              marginTop: 50,
              backgroundColor: "#35d3db",
              borderRadius: 20,
              padding: 20,
              width: 200,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "300",
                textAlign: "center",
                color: "white",
              }}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cd7f01",
    flexDirection: "column",
  },
  header: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    elevation: 15,
  },
  body: {
    height: "50%",
    backgroundColor: "#dceffc",
    alignContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
