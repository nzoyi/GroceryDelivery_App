import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import Constants from "expo-constants";
import COLORS from "../../Colors/Colors";
import { Image } from "react-native";
import { firebase } from "../Connection/firebaseDB";
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

import StarRating from "react-native-star-rating-widget";

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

export default function ShowCalc({ item }) {
  //console.log(item.Price);
  const [numberValue, setNumber] = useState(item.Quantity);
  const [finalPrice, setFinalPrice] = useState("");

  function getNumber() {
    //console.log(Quantity);
    setNumber(numberValue);
    return numberValue;
  }

  function getFinal() {
    let original = item.Price / numberValue;
    console.log(original);
    if (numberValue == 1) {
      return original;
    } else {
      return original * numberValue;
    }
  }

  function checkNum() {
    setNumber(numberValue + 1);
  }

  function checkNum2() {
    if (numberValue == 1) {
    } else {
      setNumber(numberValue - 1);
    }
  }

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: "800", marginTop: 5 }}>
        UGX {getFinal()}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: 150,
        }}
      >
        <TouchableOpacity onPress={() => checkNum2()}>
          <Icon name="remove-circle" style={{ color: "green" }} size={30} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "800",
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          {numberValue}
        </Text>
        <TouchableOpacity onPress={() => checkNum()}>
          <Icon name="add-circle" style={{ color: "green" }} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
