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

export default function UserProfile({ navigation, route }) {
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

  const [aboutVisible, setAboutVisible] = useState(false);

  const toggleBottom = () => {
    setAboutVisible(!aboutVisible);
  };

  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
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
        setUserImage(dataVal.Profile);
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

  const [number1, setNumber1] = useState();

  const itemsRef = db.ref("UserAccounts/" + user.uid + "/Orders/");

  function userInfo2() {
    let isMounted = true;
    itemsRef.on("value", (snapshot) => {
      if (isMounted) {
        let total1 = 0;
        total1 += snapshot.numChildren();

        setNumber1(total1);
      }
    });
  }

  const [number2, setNumber2] = useState();

  const itemsRef2 = db.ref("UserAccounts/" + user.uid + "/Coupons/");

  function userInfo3() {
    let isMounted = true;
    itemsRef2.on("value", (snapshot) => {
      if (isMounted) {
        let total1 = 0;
        total1 += snapshot.numChildren();

        setNumber2(total1);
      }
    });
  }

  useEffect(() => {
    userInfo();
    userInfo2();
    userInfo3();
  }, []);

  //console.log(number1);

  const RemoteImage = ({ uri, desiredWidth }) => {
    const [desiredHeight, setDesiredHeight] = React.useState(0);

    Image.getSize(uri, (width, height) => {
      setDesiredHeight((desiredWidth / width) * height);
    });

    return (
      <Image
        source={{ uri }}
        borderRadius={50}
        style={{
          borderWidth: 1,
          width: desiredWidth,
          height: desiredWidth,
          alignSelf: "center",
          borderColor: "green",
          marginTop: -50,
        }}
      />
    );
  };

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

            <Text style={styles2.modalText}>Product</Text>
            <View></View>
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>
      </View>
    );
  }

  function SaveData() {}

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ImageBackground
          blurRadius={10}
          source={{
            uri: userImage
              ? userImage
              : "https://media.sproutsocial.com/uploads/2018/04/Facebook-Cover-Photo-Size.png",
          }}
          style={{
            height: 250,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 10,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="keyboard-arrow-left"
                size={40}
                style={{ color: "white" }}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View
          style={{
            marginTop: -100,
            borderRadius: 30,
            backgroundColor: "white",
            elevation: 10,
          }}
        >
          <RemoteImage
            resizeMethod="auto"
            resizeMode="stretch"
            uri={
              userImage
                ? userImage
                : "https://media.sproutsocial.com/uploads/2018/04/Facebook-Cover-Photo-Size.png"
            }
            desiredWidth={100}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                marginLeft: 10,
                marginRight: 10,
                padding: 10,
                minHeight: 300,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "600",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {username}
              </Text>

              <View
                style={{
                  borderBottomColor: "grey",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  marginTop: 10,
                  width: "80%",
                  alignSelf: "center",
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("Orders")}
                  style={{
                    backgroundColor: "#11d6bc",
                    padding: 5,
                    borderRadius: 5,
                    width: 120,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: 25,
                      }}
                    >
                      {number1 ? number1 : 0}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: 18,
                        letterSpacing: 5,
                      }}
                    >
                      ORDER
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Coupons")}
                  style={{
                    backgroundColor: "#11d6bc",
                    padding: 5,
                    borderRadius: 5,
                    width: 120,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: 25,
                      }}
                    >
                      {number2 ? number2 : 0}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: 18,
                        letterSpacing: 5,
                      }}
                    >
                      COUPONS
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "800" }}>
                    Location
                  </Text>
                  <Text
                    style={{ fontSize: 20, fontWeight: "800", color: "blue" }}
                  >
                    Edit
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomColor: "grey",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginTop: 10,
                    width: "100%",
                    alignSelf: "center",
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "800" }}>
                    Country
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: "800" }}>
                    {address1}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "800" }}>City</Text>
                  <Text style={{ fontSize: 20, fontWeight: "800" }}>
                    {address2}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "800" }}>
                    Home Address
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: "800" }}>
                    {address3}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
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
    backgroundColor: "#f0f2f5",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
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
