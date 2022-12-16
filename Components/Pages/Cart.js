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

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");

  const itemsRef4 = db.ref("UserAccounts/" + user.uid);

  function userInfo() {
    let isMounted = true;
    itemsRef4.on("value", (snapshot) => {
      if (isMounted) {
        let dataVal = snapshot.val();
        setUsername(dataVal.Name);
        setPhone(dataVal.Contact);
        setAddress1(dataVal.Country);
        setAddress2(dataVal.City);
        setAddress3(dataVal.Locale);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    ItemImages();
    userInfo();
  }, []);

  const [validPromo, setValidPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoPerc, setPromoPerc] = useState(0);
  const [promoUsers, setPromoUsers] = useState(0);
  const [promoId, setPromoId] = useState("");

  const [aboutVisible, setAboutVisible] = useState(false);

  const toggleBottom = () => {
    setAboutVisible(!aboutVisible);
  };

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
                {items.key.Category}
              </Text>

              <ShowCalc item={items.key} itemid={items.id} />
            </View>
            <View style={{ position: "absolute", right: 10, top: 10 }}>
              <TouchableOpacity onPress={() => deleteItem(items.id)}>
                <Icon name="delete-outline" size={30} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  function deleteItem(id) {
    const itemsRef2 = db.ref("Cart/" + user.uid);
    itemsRef2
      .child(id)
      .remove()
      .then(showToast("Product Deleted Successfully"))
      .catch((error) => showToast("Error" + error));
  }

  function getTotal() {
    let PriceNumber;

    PriceNumber = itemArray.reduce(
      (sum, product) => sum + product.key.Price,
      0
    );
    let math = promoPerc / 100;
    let math2 = PriceNumber * math;
    return PriceNumber - math2 + 5000;
  }

  //Custome Design

  function customDesign() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={() => setAboutVisible(false)}>
              <Icon
                name="close"
                size={20}
                style={{
                  marginLeft: 5,
                  marginRight: 10,
                  color: "white",
                  backgroundColor: "red",
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>

            <Text style={styles2.modalText}>Payment Details</Text>
            <View></View>
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View
            style={{
              margin: 10,
              padding: 10,
              borderRadius: 5,
              elevation: 2,
              backgroundColor: "white",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18 }}>Name</Text>
              <Text style={{ fontSize: 18 }}>{username}</Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18 }}>Phone Number</Text>
              <Text style={{ fontSize: 18 }}>{phone}</Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18 }}>Country</Text>
              <Text style={{ fontSize: 18 }}>{address1}</Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18 }}>City</Text>
              <Text style={{ fontSize: 18 }}>{address2}</Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18 }}>Local Address</Text>
              <Text style={{ fontSize: 18 }}>{address3}</Text>
            </View>
            <Text
              style={{
                fontSize: 18,
                color: "blue",
                margin: 10,
                alignSelf: "flex-end",
              }}
            >
              Edit
            </Text>
          </View>
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              padding: 10,
              borderRadius: 5,
              elevation: 2,
              backgroundColor: "white",
            }}
          >
            <Text style={styles2.modalText}>Choose Payment Method</Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => OrderNow()}
                style={{
                  backgroundColor: "blue",
                  borderRadius: 5,
                  color: "white",
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: "white",
                    fontWeight: "800",
                  }}
                >
                  CASH ON DELIVERY
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "orange",
                  borderRadius: 5,
                  color: "white",
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: "white",
                    fontWeight: "800",
                  }}
                >
                  MOBILE MONEY
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  //Finish Payment

  const recKey = db.ref("UserAccounts/" + user.uid + "/Orders/").push().key;

  const date = new Date().toLocaleString();

  function OrderNow() {
    const itemsRef6 = db.ref("Cart/" + user.uid);

    itemArray.map((items) => {
      const itemsRef = db
        .ref("UserAccounts/" + user.uid + "/Orders/" + recKey + "/Items")
        .push();

      itemsRef
        .set(items.key)
        .then(() => {
          if (promoPerc > 0) {
            //console.log("yes")
            const itemsRef3 = db.ref("PromoCodes/" + promoId + "/" + user.uid);
            itemsRef3.child(user.uid).set(true);

            let users = promoUsers - 1;

            const itemsRef = db.ref("PromoCodes/" + promoId);
            itemsRef.child("NumberOfUsers").set(users);
          }

          const itemsRef3 = db.ref(
            "UserAccounts/" + user.uid + "/Orders/" + recKey
          );
          itemsRef3.child("Date").set("" + date);
          itemsRef3.child("Amount").set(getTotal());
          itemsRef3.child("PaymentMethod").set("Cash On Delivery");
          itemsRef3.child("Status").set("Pending");
          itemsRef3
            .child("TransportFee")
            .set(5000)
            .then(() => {
              /*  itemsRef6
                .remove()
                .then(() => navigation.navigate("Orders"))
                .catch((error) => showToast("Error" + error));*/
            })
            .catch((error) => showToast("error" + error));
        })
        .catch((error) => showToast("Error" + error));
    });
  }

  //SHow Caution
  function showCaution() {
    Alert.alert(
      "Delete Cart",
      "Are you sure you want to delete all items from cart?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteItem2() },
      ]
    );
  }

  function deleteItem2() {
    const itemsRef2 = db.ref("Cart/" + user.uid);
    itemsRef2
      .remove()
      .then(showToast("Deleted Successfully"))
      .catch((error) => showToast("Error" + error));
  }

  //Promo Code

  function ValidateCode() {
    const codeList = db.ref("PromoCodes/");
    codeList
      .orderByChild("Code")
      .equalTo(promoCode)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            let dataVal1 = child.key;
            let dataVal = child.val();
            if (child.child(user.uid).exists()) {
              showToast("Code Already Used");
            } else {
              setValidPromo(true);
              setPromoUsers(dataVal.NumberOfUsers);
              setPromoPerc(dataVal.Percentage);

              setPromoId(dataVal1);
            }
          });
        } else {
          showToast("Invalid Promo Code");
        }
      });
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
          {itemArray.length < 0 ? (
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
              <TouchableOpacity onPress={() => navigation.navigate("MainPage")}>
                <Text
                  style={{ textAlign: "center", fontSize: 20, color: "blue" }}
                >
                  Order Now
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <ShowCart />
            </ScrollView>
          )}

          <View
            style={{
              minHeight: 100,
              backgroundColor: "white",
              marginTop: 20,
            }}
          >
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
                onChangeText={(text) => setPromoCode(text)}
                style={styles.searchInputContainer}
              />
              {validPromo ? (
                <Icon
                  name="check-circle"
                  size={20}
                  style={{
                    color: "green",
                    alignSelf: "flex-end",
                    padding: 5,

                    right: 10,
                  }}
                />
              ) : (
                <TouchableOpacity onPress={() => ValidateCode()}>
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
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
                marginLeft: 20,
                marginRight: 20,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                Transport Fee
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>UGX 5000</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
                marginLeft: 20,
                marginRight: 20,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                Percentage
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                {promoPerc ? promoPerc : 0}% OFF
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
                marginLeft: 20,
                marginRight: 20,
                marginBottom: 20,
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
              <TouchableOpacity onPress={() => showCaution()}>
                <Text
                  style={{ color: "blue", fontSize: 20, fontWeight: "700" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAboutVisible(true)}
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
        <BottomSheet visible={aboutVisible} onBackButtonPress={toggleBottom}>
          <View style={styles2.bottomNavigationView}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
              }}
            >
              {customDesign()}
            </View>
          </View>
        </BottomSheet>
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
  modalView: {
    backgroundColor: "#b1b1b3",
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

const styles2 = StyleSheet.create({
  bottomNavigationView: {
    width: "100%",
    position: "absolute",
    backgroundColor: "grey",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
  },
});
