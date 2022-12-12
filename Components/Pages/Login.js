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

export default function Login({ navigation }) {
  function handleBackButtonClick() {
    //navigation.replace("MainPage");
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

  const [email, setEmail] = useState([]);
  const [password, onPassword] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(true);

  const handleLogin = () => {
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        const itemsRef1 = db.ref("/UserAccounts/" + user.uid);

        itemsRef1.on("value", (snapshot) => {
          if (snapshot.exists()) {
            navigation.replace("MainPage");
            setLoading(false);
          } else {
            alert("Account doesn't exist");
            setLoading(false);
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        alert("Wrong Email or Password");
      });
  };

  const [loading, setLoading] = React.useState(false);

  const Loader = ({ visible = false }) => {
    return (
      visible && (
        <View
          style={{
            alignSelf: "center",
            padding: 10,
          }}
        >
          <View
            style={{
              marginHorizontal: 50,
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <ActivityIndicator
              size="small"
              animating={true}
              color={COLORS.blue}
            />
            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "700" }}>
              Please Wait...
            </Text>
          </View>
        </View>
      )
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/health_pc.jpg")}
          blurRadius={20}
          borderBottomRightRadius={200}
          style={{
            backgroundColor: "white",
            borderBottomRightRadius: 200,
            height: 300,
            elevation: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/cityFoods.png")}
            style={{
              width: 150,
              height: 150,
              alignSelf: "center",
              elevation: 10,
            }}
          />
        </ImageBackground>

        <View style={{ marginTop: 50 }}>
          <View style={styles.searchInputContainer}>
            <Icon name="email" size={20} style={{ marginLeft: 20 }} />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              keyboardType="email-address"
              defaultValue={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.searchInputContainer}>
            <Icon name="lock" size={20} style={{ marginLeft: 20 }} />
            <TextInput
              style={styles.input}
              onChangeText={(text) => onPassword(text)}
              value={password}
              maxLength={15}
              placeholder="Password"
              secureTextEntry={passwordVisible}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              handleLogin();
            }}
            style={{
              marginTop: 10,
              backgroundColor: "#35d3db",
              borderRadius: 20,
              padding: 10,
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
              Login
            </Text>
          </TouchableOpacity>
          <Loader visible={loading} />
          <Text style={{ alignSelf: "center", fontSize: 17, marginTop: 10 }}>
            ----------OR-----------
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dce1e8",
    flexDirection: "column",
  },
  header: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    elevation: 15,
  },
  searchInputContainer: {
    backgroundColor: "#f9f9f9",
    width: "90%",
    height: 60,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    alignSelf: "center",
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
