/** @format */

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

import StarRating from "react-native-star-rating-widget";
import {
  equalTo,
  get,
  onValue,
  orderByChild,
  query,
  ref,
  remove,
  set,
} from "firebase/database";

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

export default function ProductDetails({ navigation, route }) {
  let user = auth.currentUser;

  if (!user) {
    navigation.replace("Login");
  }

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

  let pId = route.params;
  const [itemArray, setItemArray] = useState([]);
  const [image, setImage] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [rating, setRating] = useState(0);

  const itemsRef = ref(db, "ItemsList/" + pId);

  function ItemImages() {
    let isMounted = true;
    get(itemsRef).then((snapshot) => {
      if (isMounted) {
        var itemArray2 = [];
        let dataVal = snapshot.val();
        setImage(dataVal.Image);
        setItemName(dataVal.Name);
        setItemCategory(dataVal.Category);
        setItemDescription(dataVal.Description);
        setItemPrice(dataVal.Price);

        LoadCategory(dataVal.Category);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    ItemImages();
    GetRating2();
  }, []);

  function LoadCategory(category) {
    let isMounted = true;

    const itemsRef2 = query(
      ref(db, "ItemsList/"),
      orderByChild("Category"),
      equalTo(category)
    );

    get(itemsRef2).then((snapshot) => {
      if (isMounted) {
        var itemArray = [];
        snapshot.forEach((child) => {
          itemArray.push({
            id: child.key,
            key: child.val(),
          });
        });
        setItemArray(itemArray);
        //console.log(itemArray);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  const RemoteImage2 = ({ uri, desiredWidth }) => {
    const [desiredHeight, setDesiredHeight] = React.useState(0);

    Image.getSize(uri).then((width, height) => {
      setDesiredHeight((desiredWidth / width) * height);
    });

    return (
      <Image
        source={{ uri }}
        borderTopLeftRadius={20}
        style={{
          borderWidth: 1,
          width: desiredWidth,
          height: desiredWidth,
          alignSelf: "center",
        }}
      />
    );
  };

  const ShowOthers = () => {
    const newData = itemArray.sort((a, b) => b.key.Price - a.key.Price);
    return (
      <View
        style={{
          backgroundColor: "white",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          margin: 10,
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Related</Text>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {newData
            .map((items, index) => {
              return index < 6 ? (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() =>
                    navigation.navigate("ProductDetails", items.id)
                  }
                >
                  <View
                    style={{
                      borderBottomRightRadius: 20,
                      borderTopLeftRadius: 20,
                      backgroundColor: "white",
                      flexDirection: "row",
                      elevation: 5,
                      width: 250,
                      margin: 5,
                    }}
                  >
                    <RemoteImage2
                      resizeMethod="auto"
                      resizeMode="stretch"
                      uri={items.key.Image}
                      desiredWidth={100}
                    />

                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        alignSelf: "flex-end",
                        backgroundColor: "orange",
                        width: 40,
                        alignItems: "flex-end",
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        padding: 5,
                      }}
                    >
                      <Icon name="add-shopping-cart" size={25} />
                    </TouchableOpacity>

                    <View
                      style={{
                        alignSelf: "center",
                        position: "absolute",
                        justifyContent: "center",
                        right: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          marginLeft: 10,
                          bottom: 15,
                        }}
                      >
                        {items.key.Name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "300",
                          marginLeft: 10,
                          bottom: 15,
                        }}
                      >
                        {items.key.Category}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "300",
                          marginLeft: 10,
                          bottom: 15,
                          color: "green",
                        }}
                      >
                        K {items.key.Price}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ) : null;
            })
            .filter((x) => x)}
        </ScrollView>
      </View>
    );
  };

  //set Number
  const [numberValue, setNumber] = useState(1);
  const [finalPrice, setFinalPrice] = useState("");

  function getFinal() {
    if (numberValue == 1) {
      return itemPrice;
    } else {
      return itemPrice * numberValue;
    }
  }

  function checkNum() {
    setNumber(numberValue + 1);
  }

  function checkNum2() {
    if (numberValue == 1) {
    } else {
      setNumber(numberValue - 1);
    }
  }

  function AddToCart() {
    const itemsRef = ref(db, "Cart/" + user.uid).push();
    itemsRef;
    set({
      id: pId,
      Name: itemName,
      Image: image,
      Category: itemCategory,
      Price: getFinal(),
      Quantity: numberValue,
    })
      .then(() => {
        showToast("Item Added Succesfully");
        navigation.navigate("Cart");
        setNumber(1);
      })
      .catch((error) => showToast("Error while Adding " + error));
  }

  const [total1, setTotal1] = useState();
  const [maxRates, setMaxRates] = useState([]);

  const itemsRef4 = ref(db, "ItemsList/" + pId + "/Rating/");

  function GetRating2() {
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
      <View style={{}}>
        <Text
          style={{
            color: COLORS.red_500,
            fontWeight: "600",
          }}
        >
          Rating {finalAnswer} Star{"s"}
        </Text>
      </View>
    );
  }

  if (user !== null) {
    const itemsRef3 = ref(db, "ItemsList/" + pId + "/Rating/" + user.uid);

    useEffect(() => {
      let isMounted = true;
      get(itemsRef3).then((snapshot) => {
        if (isMounted) {
          if (snapshot.exists()) {
            let dataVal = snapshot.val();
            setRating(dataVal.rating);
          } else {
            setRating(0);
          }
        }
      });
      return () => {
        isMounted = false;
      };
    }, []);
  }

  if (rating && user !== null) {
    const itemsRef = ref(db, "ItemsList/" + pId + "/Rating/" + user.uid);
    set(itemsRef, { rating: rating });
  }

  function setFavorite() {
    let isValid = true;

    const itemsRef3 = ref(db, "UserAccounts/" + user.uid + "/Favorite/" + pId);
    onValue(itemsRef3, (snapshot) => {
      if (snapshot.exists()) {
        isValid = false;
      } else {
        isValid = true;
      }
    });

    if (isValid) {
      const itemsRef = ref(db, "UserAccounts/" + user.uid + "/Favorite/" + pId);
      set(itemsRef, { id: pId });
    } else {
      const itemsRef = ref(db, "UserAccounts/" + user.uid + "/Favorite/" + pId);
      remove(itemsRef);
    }
  }

  const [fav, setFav] = useState(false);

  useEffect(() => {
    const itemsRef3 = ref(db, "UserAccounts/" + user.uid + "/Favorite/" + pId);
    get(itemsRef3).then((snapshot) => {
      if (snapshot.exists()) {
        setFav(true);
      } else {
        setFav(false);
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ImageBackground
              source={image ? { uri: image } : null}
              borderBottomRightRadius={200}
              borderBottomLeftRadius={10}
              resizeMode="stretch"
              style={{
                height: 320,
                backgroundColor: "#0fa614",
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 190,
                elevation: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: 20,
                }}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon
                    name="keyboard-arrow-left"
                    size={30}
                    style={{
                      backgroundColor: "#0fa614",
                      padding: 10,
                      borderRadius: 10,
                      color: "white",
                    }}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setFavorite()}>
                  {fav == true ? (
                    <Icon
                      name="favorite"
                      size={30}
                      style={{
                        backgroundColor: "red",
                        padding: 10,
                        borderRadius: 10,
                        color: "white",
                      }}
                    />
                  ) : (
                    <Icon
                      name="favorite"
                      size={30}
                      style={{
                        backgroundColor: "#0fa614",
                        padding: 10,
                        borderRadius: 10,
                        color: "white",
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </ImageBackground>
            <View
              style={{
                backgroundColor: "white",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                margin: 10,
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={{ fontSize: 25, fontWeight: "800" }}>
                    {itemName}
                  </Text>
                  <Rating id={pId} />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity onPress={() => checkNum2()}>
                    <Icon
                      name="remove-circle"
                      style={{ color: "green" }}
                      size={30}
                    />
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
                    <Icon
                      name="add-circle"
                      style={{ color: "green" }}
                      size={30}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={{ marginTop: 10, fontSize: 20, fontWeight: "500" }}>
                Description
              </Text>
              <Text style={{ marginTop: 10, fontSize: 20, fontWeight: "500" }}>
                {itemDescription}
              </Text>
            </View>
            <ShowOthers />

            <View
              style={{
                marginTop: 10,
                padding: 10,
                marginBottom: 10,
                backgroundColor: COLORS.whiteTextColor,
                elevation: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Ratings</Text>
                {getTotalRating()}
              </View>
              <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
                ~Rate Product~
              </Text>

              <View style={{ alignSelf: "center" }}>
                <StarRating
                  rating={rating}
                  starSize={40}
                  enableHalfStar={false}
                  enableSwiping={false}
                  onChange={setRating}
                />
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              padding: 10,
              backgroundColor: "white",
              flexDirection: "row",
              alignItems: "center",
              height: 80,
              justifyContent: "space-between",
            }}
          >
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontWeight: "700", fontSize: 17 }}>Price</Text>
              <Text style={{ fontWeight: "700", fontSize: 25 }}>
                K {getFinal()}
              </Text>
            </View>
            <TouchableOpacity onPress={() => AddToCart()}>
              <View
                style={{
                  backgroundColor: COLORS.green_light,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "800" }}
                >
                  Add to Cart
                </Text>
              </View>
            </TouchableOpacity>
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
  body: {
    height: "50%",
    backgroundColor: "#dceffc",
    alignContent: "center",
    alignItems: "center",
  },
});
