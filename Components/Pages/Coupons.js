import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  AppState,
  BackHandler,
  TouchableWithoutFeedback,
  Animated,
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

export default function Coupons({ navigation, route }) {
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

  const itemsRef2 = db.ref("UserAccounts/" + user.uid + "/Coupons/");

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

  const RemoteImage = ({ uri, desiredWidth }) => {
    const [desiredHeight, setDesiredHeight] = React.useState(0);

    Image.getSize(uri, (width, height) => {
      setDesiredHeight((desiredWidth / width) * height);
    });

    return (
      <Image
        source={{ uri }}
        borderTopLeftRadius={10}
        borderBottomLeftRadius={10}
        resizeMode="stretch"
        style={{
          borderWidth: 1,
          width: desiredWidth,
          height: desiredWidth,
          alignSelf: "center",
        }}
      />
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  const [setActiveCardIndex] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  //Tabs
  const ShowAll = ({ item }) => {
    return (
      <View style={styles.centerContent}>
        <Animated.ScrollView
          onMomentumScrollEnd={(e) => {
            setActiveCardIndex(
              Math.round(e.nativeEvent.contentOffset.x / cardWidth)
            );
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        >
          <ShowCoupons items={item.key} />
        </Animated.ScrollView>
      </View>
    );
  };

  const ShowCoupons = ({ items }) => {
    var given = moment(items.ExpiryDate, "DD/MM/YYYY");
    var current = moment().startOf("day");

    const finalDate = moment.duration(given.diff(current)).asDays();

    if (finalDate > 0) {
      return (
        <View>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              minHeight: 100,
              elevation: 5,
              margin: 5,
              flexDirection: "row",
            }}
          >
            <RemoteImage
              resizeMethod="auto"
              resizeMode="stretch"
              uri={items.Image}
              desiredWidth={150}
            />
            {items.Used == "Yes" ? (
              <View
                style={{
                  width: 150,
                  position: "absolute",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "800",
                    color: "white",
                    fontSize: 25,
                    position: "absolute",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 150,
                    textAlign: "center",
                    backgroundColor: "red",
                    transform: [{ rotate: "-40deg" }],
                  }}
                ></Text>
                <Text
                  style={{
                    fontWeight: "800",
                    color: "white",
                    fontSize: 25,
                    width: 150,
                    textAlign: "center",
                    backgroundColor: "red",
                    transform: [{ rotate: "40deg" }],
                  }}
                >
                  USED
                </Text>
              </View>
            ) : null}

            <View style={{ margin: 10, flex: 1 }}>
              <Text
                style={{
                  color: "red",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                {items.Coupon}
              </Text>
              <Text
                style={{
                  color: "black",
                  fontSize: 30,
                  fontWeight: "400",
                }}
              >
                {items.Offer} % Off
              </Text>
              <Text
                style={{
                  color: "black",
                  fontSize: 15,
                  fontWeight: "400",
                }}
              >
                Until {items.ExpiryDate}
              </Text>
              {items.Used == "No" ? (
                <Text
                  style={{
                    color: "black",
                    fontSize: 20,
                    fontWeight: "800",
                  }}
                >
                  CODE: {items.PromoCode}
                </Text>
              ) : null}
              {items.Used == "No" ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Cart", items.PromoCode)}
                  style={{
                    backgroundColor: "green",
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "800",
                    }}
                  >
                    USE COUPON
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    backgroundColor: "black",
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "800",
                    }}
                  >
                    Used
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              minHeight: 100,
              elevation: 5,
              margin: 5,
              flexDirection: "row",
            }}
          >
            <RemoteImage
              resizeMethod="auto"
              resizeMode="stretch"
              uri={items.Image}
              desiredWidth={150}
            />
            {items.Used == "Yes" ? (
              <View
                style={{
                  width: 150,
                  position: "absolute",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "800",
                    color: "white",
                    fontSize: 25,
                    position: "absolute",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 150,
                    textAlign: "center",
                    backgroundColor: "red",
                    transform: [{ rotate: "-40deg" }],
                  }}
                ></Text>
                <Text
                  style={{
                    fontWeight: "800",
                    color: "white",
                    fontSize: 25,
                    width: 150,
                    textAlign: "center",
                    backgroundColor: "red",
                    transform: [{ rotate: "40deg" }],
                  }}
                >
                  USED
                </Text>
              </View>
            ) : null}

            <View style={{ margin: 10, flex: 1 }}>
              <Text
                style={{
                  color: "red",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                {items.Coupon}
              </Text>
              <Text
                style={{
                  color: "black",
                  fontSize: 30,
                  fontWeight: "400",
                }}
              >
                {items.Offer} % Off
              </Text>
              <Text
                style={{
                  color: "black",
                  fontSize: 15,
                  fontWeight: "400",
                }}
              >
                Until {items.ExpiryDate}
              </Text>
              <View
                style={{
                  backgroundColor: "black",
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "800",
                  }}
                >
                  Expired
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }
  };

  function useCoupon() {}

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
            Coupons
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {itemArray.length == 0 ? (
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
                No Coupons Available
              </Text>
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                To Earn Coupons Make More Orders
              </Text>

              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text
                  style={{ textAlign: "center", fontSize: 20, color: "blue" }}
                >
                  Order Now
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={itemArray}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={ShowAll}
            />
          )}
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
