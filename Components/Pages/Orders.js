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

export default function Orders({ navigation, route }) {
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

  const itemsRef2 = db.ref("UserAccounts/" + user.uid + "/Orders/");

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

        //const newData = itemArray.sort((a, b) => b.key.Date - a.key.Date);
        setItemArray(itemArray.reverse());
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    ItemImages();
  }, []);

  const ShowOrders = () => {
    return (
      <View>
        {itemArray.map((items, index) => (
          <View
            style={{
              margin: 10,
              backgroundColor: "white",
              elevation: 5,
              padding: 10,
              minHeight: 100,
            }}
            key={index}
          >
            <View style={{ flexDirection: "column" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  Order Date:{" "}
                  {moment(items.key.Date).format("DD/MM/YYYY, h:mm:ss a")}
                </Text>
                {items.key.Status == "Delivered" ? null : items.key.Status ==
                  "Pending" ? (
                  <TouchableOpacity
                    onPress={() =>
                      cancelOrder({
                        Payment: items.key.PaymentMethod,
                        Status: items.key.Status,
                      })
                    }
                  >
                    <Text style={{ color: "red", fontWeight: "600" }}>
                      Cancel Order
                    </Text>
                  </TouchableOpacity>
                ) : items.key.Status == "Cancelled" ? null : (
                  <TouchableOpacity
                    onPress={() =>
                      cancelOrder({
                        Payment: items.key.PaymentMethod,
                        Status: items.key.Status,
                      })
                    }
                  >
                    <Text style={{ color: "red", fontWeight: "600" }}>
                      Cancel Order
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text>Ordered Items</Text>
            </View>
            <View
              style={{ flexDirection: "row", minHeight: 50, marginLeft: 10 }}
            >
              <View style={styles.verticleLine}></View>
              <GetItems id={items.id} />
            </View>
            <View style={{ flexDirection: "column", marginTop: 10 }}>
              <Text>Payment Method {items.key.PaymentMethod}</Text>
              <Text style={{ fontWeight: "500" }}>
                Charge Fee : {items.key.Charge}
              </Text>
              <Text style={{ fontWeight: "500" }}>
                Transport Fee : {items.key.TransportFee}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "700" }}>
                Total Price : UGX{" "}
                <CalcPrice
                  p1={items.key.Amount}
                  p2={items.key.Charge}
                  p3={items.key.TransportFee}
                />
              </Text>
              {items.key.Status == "Pending" ? (
                <Text style={{ color: "blue", fontWeight: "700" }}>
                  Order Pending
                </Text>
              ) : items.key.Status == "Transit" ? (
                <Text style={{ color: "orange", fontWeight: "700" }}>
                  Order Arriving Soon
                </Text>
              ) : items.key.Status == "Cancelled" ? (
                <Text style={{ color: "red", fontWeight: "700" }}>
                  Order Cancelled
                </Text>
              ) : (
                <Text style={{ color: "green", fontWeight: "700" }}>
                  Order Delivered
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const CalcPrice = ({ p1, p2, p3 }) => {
    return p1 + p2 + p3;
  };

  function cancelOrder({ Payment, Status }) {
    if (Payment == "MobileMoney") {
      Alert.alert("Caution", "Mobile Money orders cannot be cancelled! Sorry", [
        { text: "OK" },
      ]);
    } else if (Payment != "MobileMoney") {
    }
  }

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
            Orders
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {itemArray.length > 0 ? (
              <ShowOrders />
            ) : (
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
                  No Items Available
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MainPage")}
                >
                  <Text
                    style={{ textAlign: "center", fontSize: 20, color: "blue" }}
                  >
                    Order Now
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
