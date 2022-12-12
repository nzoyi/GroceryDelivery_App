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

export default function Cart({ navigation, route }) {
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

  const itemsRef2 = db.ref("Cart/" + user.uid);

  function ItemImages() {
    let isMounted = true;
    itemsRef2.on("value", (snapshot) => {
      if (isMounted) {
        var itemArray = [];
        snapshot.forEach((child) => {
          itemArray.push({
            id: child.key,
            key: child.val(),
          });
        });
        setItemArray(itemArray);
        // console.log(itemArray);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    ItemImages();
  }, []);

  const [numberValue, setNumber] = useState(1);
  const [finalPrice, setFinalPrice] = useState("");

  function getNumber(Quantity) {
    //console.log(Quantity);
    setNumber(Quantity);
    return numberValue;
  }

  function getFinal(Price) {
    var origin = Price / numberValue;
    if (numberValue == 1) {
      return origin;
    } else {
      return origin * numberValue;
    }
  }

  function checkNum(Quantity) {
    console.log(Quantity);
    setNumber(Quantity + 1);
  }

  function checkNum2(Quantity) {
    if (Quantity == 1) {
    } else {
      setNumber(Quantity - 1);
    }
  }

  const ShowCart = () => {
    return (
      <View>
        {itemArray.map((items, index) => (
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              margin: 5,
              backgroundColor: "white",
              borderRadius: 20,
            }}
            key={index}
          >
            <Image
              source={{ uri: items.key.Image }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 10,
              }}
            />
            <View style={{ marginLeft: 30 }}>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>
                {items.key.Name}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "400" }}>
                {items.key.Name}
              </Text>

              <ShowCalc item={items.key} />
            </View>
          </View>
        ))}
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
            padding: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="keyboard-arrow-left" size={40} />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 30 }}>
            Shopping Cart
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {itemArray.length > 0 ? <ShowCart /> : null}
          </ScrollView>
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
  body: {
    height: "50%",
    backgroundColor: "#dceffc",
    alignContent: "center",
    alignItems: "center",
  },
});
