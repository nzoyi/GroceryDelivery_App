/** @format */

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
import { ref, set } from "firebase/database";

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

export default function ShowCalc({ item, itemid }) {
  const [numberValue, setNumber] = useState(item.Quantity);
  const [finalPrice, setFinalPrice] = useState("");

  let user = firebase.auth().currentUser;

  function getNumber() {
    //console.log(Quantity);
    setNumber(numberValue);
    return numberValue;
  }

  let origin = parseInt(item.Price);
  var getDa = origin / item.Quantity;

  function getFinal() {
    if (numberValue == 1) {
      return getDa;
    } else {
      return getDa * numberValue;
    }
  }

  function checkNum() {
    setNumber(numberValue + 1);

    //changeData(numberValue + 1);
  }

  function checkNum2() {
    if (numberValue == 1) {
    } else {
      setNumber(numberValue - 1);

      //changeData(numberValue - 1);
    }
  }

  useEffect(() => {
    if (numberValue == item.Quantity) {
    } else {
      changeData();
    }
  }, [numberValue]);

  function changeData() {
    const itemsRef = ref(db, "Cart/" + user.uid + "/" + itemid);

    set(itemsRef, { Price: getFinal() });

    set(itemsRef, { Quantity: numberValue });
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
