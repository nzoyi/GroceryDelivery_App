import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  AppState,
  BackHandler,
  TouchableWithoutFeedback,
  SafeAreaView,
  Linking,
} from "react-native";
import Constants from "expo-constants";
import { BottomSheet } from "react-native-btr";
import COLORS from "../../Colors/Colors";
import { Image } from "react-native";
import { auth, firebase } from "../Connection/firebaseDB";
// Using DB Reference
import { db } from "../Connection/firebaseDB";

import {
  ToastAndroid,
  Platform,
  AlertIOS,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native";
import moment from "moment";
import GetItems from "./GetItems";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TextInput } from "react-native";

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

  const [showBottom, setShowBottom] = useState(false);

  const toggleBottom = () => {
    setShowBottom(!showBottom);
  };

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
        setItemArray(itemArray.reverse());
      }
    });
    return () => {
      isMounted = false;
    };
  }

  const [phoneLink, setPhone] = useState("");
  const itemData5 = db.ref("Links");
  function linkData() {
    let isMounted = true;
    itemData5.on("value", (snapshot) => {
      var links = [];
      if (isMounted) {
        let dataSet = snapshot.val();

        setPhone(dataSet.PhoneLink);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    ItemImages();
    linkData();
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
                        id: items.id,
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
                        id: items.id,
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
                Charge Price : UGX{" "}
                <CalcPrice p1={items.key.Amount} p3={items.key.TransportFee} />
              </Text>
              <Text style={{ fontWeight: "500" }}>
                Transport Fee : UGX {items.key.TransportFee}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "700" }}>
                Total Price : UGX{items.key.Amount}
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

  const CalcPrice = ({ p1, p3 }) => {
    return p1 - p3;
  };

  function cancelOrder({ Payment, id }) {
    if (Payment == "MobileMoney") {
      Alert.alert("Caution", "Mobile Money orders cannot be cancelled! Sorry", [
        { text: "OK" },
      ]);
    } else if (Payment != "MobileMoney") {
      Alert.alert("Delete Cart", "Are you sure you want to cancel Order?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteItem2(id) },
      ]);
    }
  }

  function deleteItem2(id) {
    const itemsRef2 = db.ref("UserAccounts/" + user.uid + "/Orders/" + id);
    itemsRef2
      .child("Status")
      .set("Cancelled")
      .then(showToast("Cancelled Successfully"))
      .catch((error) => showToast("Error" + error));
  }

  const [isMSG, setMSG] = useState(false);
  const [message, setMessage] = useState("");

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
            <TouchableOpacity
              onPress={() => {
                setShowBottom(false);
                setMSG(false);
              }}
            >
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

            {isMSG ? (
              <Text style={styles2.modalText}>Whatsapp Message</Text>
            ) : (
              <Text style={styles2.modalText}>Choose Method</Text>
            )}
            <View></View>
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginBottom: 5,
            }}
          />
          <View>
            {isMSG ? (
              <View>
                <View
                  style={{
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    backgroundColor: "white",
                    flex: 1,
                    marginLeft: 10,
                    marginRight: 10,
                    elevation: 5,
                    backgroundColor: "white",
                    minHeight: 50,
                    padding: 5,
                  }}
                >
                  <TextInput
                    placeholder="Type a message here!"
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                    multiline={true}
                    underlineColorAndroid="transparent"
                    style={{
                      width: "100%",
                      textAlign: "auto",
                      fontSize: 16,
                      borderRadius: 10,
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => sendMessage()}
                  style={{
                    backgroundColor: "green",
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 10,
                    width: 200,
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Icon
                      name="whatsapp"
                      size={20}
                      style={{
                        color: "white",
                        justifyContent: "center",
                      }}
                    />
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "800",
                        fontSize: 17,
                      }}
                    >
                      Send Message
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 5,
                  justifyContent: "space-between",
                }}
              >
                <TouchableWithoutFeedback onPress={() => MakeCall()}>
                  <View
                    style={{
                      width: "40%",
                      height: 60,
                      backgroundColor: "black",
                      padding: 5,
                      borderRadius: 10,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="phone-outline"
                      size={30}
                      style={{
                        color: "white",
                        justifyContent: "center",
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        marginLeft: 10,
                        color: "white",
                      }}
                    >
                      Make Call
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => setMSG(true)}>
                  <View
                    style={{
                      width: "40%",
                      height: 60,
                      backgroundColor: "#187002",
                      padding: 5,
                      borderRadius: 10,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="whatsapp"
                      size={30}
                      style={{
                        color: "white",
                        justifyContent: "center",
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        marginLeft: 10,
                        color: "white",
                      }}
                    >
                      Message
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  function sendMessage() {
    if (!message) {
      showToast("Type A Message to send");
    } else {
      let text = "whatsapp://send?text=" + message + "&phone=" + phoneLink;
      Linking.canOpenURL(text)
        .then((supported) => {
          if (!supported) {
            Alert.alert(
              "Please install whatsapp to send direct message via whatsapp"
            );
          } else {
            return Linking.openURL(text)
              .then(() => {
                showToast("Message sent Succesfully");
                setMessage(null);
              })
              .catch((error) => showToast("Error " + error));
          }
        })
        .catch((err) => console.error("An error occurred", err));
    }
  }

  function MakeCall() {
    Linking.openURL(`tel:${phoneLink}`)
      .then(setShowBottom(false))
      .catch((error) => showToast("Error " + error));
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
            <Icon name="arrow-left" size={40} />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 10 }}>
            Orders
          </Text>
          <TouchableOpacity
            onPress={() => setShowBottom(true)}
            style={{
              position: "absolute",
              right: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "blue",
              }}
            >
              Support
            </Text>
          </TouchableOpacity>
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
        <BottomSheet visible={showBottom} onBackButtonPress={toggleBottom}>
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

const styles2 = StyleSheet.create({
  bottomNavigationView: {
    width: "100%",
    position: "absolute",
    backgroundColor: "grey",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
