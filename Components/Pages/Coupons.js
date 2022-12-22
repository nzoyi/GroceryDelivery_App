import React, { useState, useEffect, useRef, useCallback } from "react";
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
import Rating from "./Rating2";
import ShowCalc from "./ShowCalc";
import GetItems from "./GetItems";

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

export default function Coupons({ navigation, route }) {
  function handleBackButtonClick() {
    navigation.goBack();
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

  let user = firebase.auth().currentUser;

  if (!user) {
    navigation.replace("Login");
  }

  const [itemArray, setItemArray] = useState([]);

  const itemsRef2 = db.ref("UserAccounts/" + user.uid + "/Coupons/");

  function userInfo3() {
    let isMounted = true;
    itemsRef2.on("value", (snapshot) => {
      if (isMounted) {
        snapshot.forEach((child) => {
          itemArray.push({
            id: child.key,
            key: child.val(),
          });

          setItemArray(itemArray);
        });
      }
    });
  }

  useEffect(() => {
    userInfo3();
  }, []);

  const ShowCoupons = () => {
    return (
      <View>
        <Text>Hello this is a Coupon</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: "white",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            elevation: 10,
            padding: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="keyboard-arrow-left" size={40} />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 30 }}>
            Coupons
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {itemArray.length == 0 ? (
            <View
              style={{
                position: "absolute",
                justifyContent: "center",
                alignSelf: "center",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                No Coupons Available
              </Text>
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                To Earn Coupons Make More Orders
              </Text>

              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text
                  style={{ textAlign: "center", fontSize: 20, color: "blue" }}
                >
                  Order Now
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <ShowCoupons />
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8eaed",
    flexDirection: "column",
  },
  header: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    elevation: 15,
  },
  verticleLine: {
    height: "100%",
    width: 1,
    backgroundColor: "black",
  },
  searchInputContainer: {
    width: "90%",
    height: 30,
    color: "black",
    fontSize: 18,
  },
  body: {
    height: "50%",
    backgroundColor: "#dceffc",
    alignContent: "center",
    alignItems: "center",
  },
});
