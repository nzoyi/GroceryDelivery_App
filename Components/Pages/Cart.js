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
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    ItemImages();
  }, []);

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
                width: 100,
                height: 100,
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

              <ShowCalc item={items.key} itemid={items.id} />
            </View>
          </View>
        ))}
      </View>
    );
  };

  function getTotal() {
    let PriceNumber;

    PriceNumber = itemArray.reduce(
      (sum, product) => sum + product.key.Price,
      0
    );
    return PriceNumber;
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
            Shopping Cart
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {itemArray.length > 0 ? <ShowCart /> : null}
          </ScrollView>
          <View style={{ minHeight: 100, backgroundColor: "white" }}>
            <View
              style={{
                backgroundColor: "#e6edf0",
                elevation: 5,
                borderRadius: 5,
                padding: 10,
                marginLeft: 20,
                marginRight: 20,
                flexDirection: "row",
                alignItems: "center",
                marginTop: -20,
              }}
            >
              <Icon
                name="loyalty"
                size={30}
                style={{
                  color: "blue",
                  transform: [{ scaleX: -1 }],
                  alignSelf: "flex-start",
                }}
              />
              <TextInput
                placeholder="Add Promo Code"
                placeholderTextColor={"black"}
                style={styles.searchInputContainer}
              />
              <Icon
                name="arrow-forward-ios"
                size={20}
                style={{
                  color: "blue",
                  alignSelf: "flex-end",
                  padding: 5,
                  backgroundColor: "white",
                  right: 10,
                  borderRadius: 20,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 20,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                Total Price
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                UGX {getTotal()}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                marginLeft: 20,
                marginRight: 20,
                marginBottom: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "blue", fontSize: 20, fontWeight: "700" }}>
                Cancel
              </Text>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: "blue",
                  borderRadius: 20,
                  width: 250,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Place Order
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
