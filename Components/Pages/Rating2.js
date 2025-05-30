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

import StarRating from "react-native-star-rating-widget";
import { get, ref } from "firebase/database";

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

export default function Rating2({ id }) {
  const [maxRates, setMaxRates] = useState([]);
  const [total1, setTotal1] = useState();
  const [stars, setStars] = useState(0);

  const itemsRef4 = ref(db, "ItemsList/" + id + "/Rating/");

  function GetRating() {
    let isMounted = true;
    get(itemsRef4).then((snapshot) => {
      if (isMounted) {
        let maxRates = [];
        let total1 = 0;
        snapshot.forEach((child) => {
          let dataVal = child.val();
          maxRates.push({
            rating: dataVal.rating,
          });
        });
        total1 += snapshot.size;
        setTotal1(total1);
        setMaxRates(maxRates);
        //console.log(maxRates);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    GetRating();
  }, []);

  function getTotalRating() {
    let numb = 0;
    let numb2;
    let numb3;
    var finalAnswer;
    let getTotal = parseInt(total1);

    if (maxRates.length == 0) {
      finalAnswer = "0";
    } else {
      maxRates.map((items) => {
        numb += items.rating;
        numb2 = numb / 5;
        numb3 = (numb2 / getTotal) * 5;
      });
      finalAnswer = (Math.round(numb3 * 100) / 100).toFixed(1);
    }

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <StarRating
          rating={finalAnswer}
          starSize={25}
          enableHalfStar={true}
          enableSwiping={false}
          onChange={setStars}
        />
        <Text style={{ fontSize: 16, fontWeight: "700" }}>
          {"(" + finalAnswer + ")"}
        </Text>
      </View>
    );
  }

  return <View style={{ marginBottom: 5 }}>{getTotalRating()}</View>;
}
