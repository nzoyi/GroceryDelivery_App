import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, View, Alert, Text, Linking } from "react-native";
import { Image } from "react-native";
import { auth, firebase } from "../Connection/firebaseDB";
// Using DB Reference
import { db } from "../Connection/firebaseDB";

import Icon from "react-native-vector-icons/MaterialIcons";

import {
  ToastAndroid,
  Platform,
  AlertIOS,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";

import { Snackbar } from "react-native-paper";

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

function OpenWhatsapp(link) {
  if (link) {
    Linking.canOpenURL(link)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            "Please install whatsapp to send direct message via whatsapp"
          );
        } else {
          return Linking.openURL(link);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  } else {
    Alert.alert("sendWhatsAppMessage -----> ", "message link is undefined");
  }
}

export default function Profile({ navigation, route }) {
  let user = firebase.auth().currentUser;

  if (!user) {
    navigation.replace("Login");
  }

  const [userName, setUsername] = useState("");
  const [uImage, setUImage] = useState("");

  const [snackIsVisible, setSnackIsVisible] = useState(false);

  const userRef = db.ref("UserAccounts/" + user.uid);
  function getUserData() {
    let isMounted = true;
    userRef.on("value", (snapshot) => {
      if (isMounted) {
        let dataVal = snapshot.val();

        setUsername(dataVal.Name);
        setUImage(dataVal.Profile);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    getUserData();
  }, []);

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
            elevation: 10,
            padding: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="keyboard-arrow-left" size={40} />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 30 }}>
            Profile
          </Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                elevation: 5,
                backgroundColor: "white",
                margin: 10,
                borderRadius: 20,
                height: 100,
                alignItems: "center",
              }}
            >
              {uImage ? (
                <Image
                  source={{ uri: uImage }}
                  style={{ width: 50, height: 50, borderRadius: 30 }}
                />
              ) : (
                <Image
                  source={require("../../assets/monkey.png")}
                  style={{ width: 50, height: 50 }}
                />
              )}
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: "grey", fontSize: 16 }}>Welcome</Text>
                <Text style={{ fontSize: 18, fontWeight: "800" }}>
                  {userName}
                </Text>
              </View>
              <Icon
                name="keyboard-arrow-right"
                size={30}
                style={{
                  position: "absolute",
                  right: 10,
                  alignSelf: "center",
                  color: "grey",
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderBottomColor: "grey",
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 10,
            width: "80%",
            alignSelf: "center",
          }}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                marginLeft: 10,
                marginRight: 10,
                alignItems: "center",
              }}
            >
              <Icon name="shopping-cart" size={30} style={{ color: "grey" }} />
              <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}>
                My Orders
              </Text>
              <Icon
                name="keyboard-arrow-right"
                size={30}
                style={{
                  position: "absolute",
                  right: 10,
                  alignSelf: "center",
                  color: "grey",
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Coupons")}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                marginLeft: 10,
                marginRight: 10,
                alignItems: "center",
              }}
            >
              <Icon name="card-giftcard" size={30} style={{ color: "grey" }} />
              <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}>
                My Coupons
              </Text>
              <Icon
                name="keyboard-arrow-right"
                size={30}
                style={{
                  position: "absolute",
                  right: 10,
                  alignSelf: "center",
                  color: "grey",
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSnackIsVisible(true)}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                marginLeft: 10,
                marginRight: 10,
                alignItems: "center",
              }}
            >
              <Icon
                name="account-balance-wallet"
                size={30}
                style={{ color: "grey" }}
              />
              <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}>
                My Wallet
              </Text>
              <Icon
                name="keyboard-arrow-right"
                size={30}
                style={{
                  position: "absolute",
                  right: 10,
                  alignSelf: "center",
                  color: "grey",
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                marginLeft: 10,
                marginRight: 10,
                alignItems: "center",
              }}
            >
              <Icon name="account-circle" size={30} style={{ color: "grey" }} />
              <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}>
                Profile
              </Text>
              <Icon
                name="keyboard-arrow-right"
                size={30}
                style={{
                  position: "absolute",
                  right: 10,
                  alignSelf: "center",
                  color: "grey",
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                marginLeft: 10,
                marginRight: 10,
                alignItems: "center",
              }}
            >
              <Icon name="settings" size={30} style={{ color: "grey" }} />
              <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}>
                Settings
              </Text>
              <Icon
                name="keyboard-arrow-right"
                size={30}
                style={{
                  position: "absolute",
                  right: 10,
                  alignSelf: "center",
                  color: "grey",
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              OpenWhatsapp(
                "whatsapp://send?text=Hello, I am " +
                  userName +
                  ", I am requesting for assistance from City Foods App Team.&phone=+256751883325"
              )
            }
          >
            <View
              style={{
                margin: 20,
                backgroundColor: "#5ae87c",
                padding: 10,
                height: 100,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderRadius: 20,
              }}
            >
              <Icon name="help" size={60} style={{ color: "#1ba10a" }} />
              <Text
                style={{
                  color: "#1ba10a",
                  fontSize: 20,
                  fontWeight: "900",
                  marginLeft: 10,
                }}
              >
                How can we help you?
              </Text>
            </View>
          </TouchableOpacity>

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
              margin: 10,
            }}
          >
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  elevation: 2,
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text>Privacy Policy</Text>
                <Icon
                  name="keyboard-arrow-right"
                  size={30}
                  style={{
                    alignSelf: "center",
                    color: "grey",
                  }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  elevation: 2,
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text>Term & Conditions</Text>
                <Icon
                  name="keyboard-arrow-right"
                  size={30}
                  style={{
                    alignSelf: "center",
                    color: "grey",
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              borderBottomColor: "grey",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginTop: 10,
              width: "80%",
              alignSelf: "center",
            }}
          />

          <Text style={{ alignSelf: "center", marginTop: 10 }}>
            © Future Designs {new Date().getFullYear()}
          </Text>
          <Text style={{ alignSelf: "center", marginTop: 10 }}>
            Version 1.0.0
          </Text>
        </ScrollView>

        <Snackbar
          visible={snackIsVisible}
          onDismiss={() => setSnackIsVisible(false)}
          action={{
            label: "Okay",
            onPress: () => setSnackIsVisible(false),
          }}
          style={{ backgroundColor: "black" }}
        >
          <View>
            <Text style={{ color: "white" }}>
              Hey there! This Service is Coming Soon!
            </Text>
          </View>
        </Snackbar>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
