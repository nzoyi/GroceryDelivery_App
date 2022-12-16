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

export default function GetItems({ id }) {
  let user = firebase.auth().currentUser;
  const [itemArray, setItemArray] = useState([]);

  const itemsRef2 = db.ref(
    "UserAccounts/" + user.uid + "/Orders/" + id + "/Items"
  );

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
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    ItemImages();
  }, []);

  return (
    <View style={{ marginLeft: 10 }}>
      {itemArray.map((items, index) => (
        <View
          style={{
            flexDirection: "row",
            margin: 5,
            justifyContent: "space-evenly",
          }}
          key={index}
        >
          <Text style={{ width: 100 }}>{items.key.Name}</Text>
          <View style={styles.verticleLine} />
          <Text style={{ width: 100, textAlign: "center" }}>
            {items.key.Quantity}
          </Text>
          <View style={styles.verticleLine} />
          <Text style={{ width: 100 }}>UGX {items.key.Price}</Text>
        </View>
      ))}
    </View>
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
    height: 20,
    marginLeft: 5,
    marginRight: 5,
    width: 2,
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
