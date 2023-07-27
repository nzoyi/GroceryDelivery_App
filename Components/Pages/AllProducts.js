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
import ShowCalc from "./ShowCalc";
import {
  equalTo,
  get,
  orderByChild,
  push,
  query,
  ref,
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

export default function AllProducts({ navigation, route }) {
  let category = route.params;

  const [itemArray, setItemArray] = useState([]);
  const [itemArray2, setItemArray2] = useState([]);
  const [search, setSearch] = useState("");

  const [filteredDataSource, setFilteredDataSource] = useState([]);

  let user = auth.currentUser;

  if (!user) {
    navigation.replace("Login");
  }

  const itemsRef2 = ref(db, "ItemsList/");

  function ItemImages() {
    let isMounted = true;
    if (category == "Recommended") {
      let isMounted = true;
      get(itemsRef2).then((snapshot) => {
        if (isMounted) {
          var itemArray2 = [];
          snapshot.forEach((child) => {
            let dataVal = child.val();
            if (child.child("Rating").exists()) {
              itemArray2.push({
                id: child.key,
                key: child.val(),
              });
            } else {
              //console.log("false");
            }
          });
          setItemArray2(itemArray2);
          setFilteredDataSource(itemArray2);
        }
      });
      return () => {
        isMounted = false;
      };
    } else {
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
          setFilteredDataSource(itemArray);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }

  useEffect(() => {
    ItemImages();
  }, []);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = itemArray.filter(function (item) {
        const itemData = item.key.Name ? item.key.Name : "";
        return itemData.indexOf(text) > -1;
      });

      setFilteredDataSource(newData);

      setSearch(text);
    } else {
      setFilteredDataSource(itemArray);
      setSearch(text);
    }
  };

  const searchFilterFunction2 = (text) => {
    if (text) {
      const newData = filteredDataSource.sort(
        (a, b) => a.key.Price - b.key.Price
      );

      setFilteredDataSource(newData);

      setSearch(text);
    } else {
      setFilteredDataSource(itemArray);
      setSearch(text);
    }
  };

  const [aboutVisible, setAboutVisible] = useState(false);

  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState("");

  const toggleBottom = () => {
    setAboutVisible(!aboutVisible);
  };

  const RemoteImage = ({ uri, desiredWidth }) => {
    const [desiredHeight, setDesiredHeight] = React.useState(0);

    Image.getSize(uri, (width, height) => {
      setDesiredHeight((desiredWidth / width) * height);
    });

    return (
      <Image
        source={{ uri }}
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        style={{
          borderWidth: 1,
          width: desiredWidth,
          height: desiredWidth,
          alignSelf: "center",
        }}
      />
    );
  };

  const RemoteImage2 = ({ uri, desiredWidth }) => {
    const [desiredHeight, setDesiredHeight] = React.useState(0);

    Image.getSize(uri, (width, height) => {
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

  const [numberValue, setNumber] = useState(1);
  const [finalPrice, setFinalPrice] = useState("");

  function getFinal() {
    if (numberValue == 1) {
      return data.Price;
    } else {
      return data.Price * numberValue;
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

  const ShowAll = () => {
    return (
      <View>
        {filteredDataSource.map((items, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => navigation.navigate("ProductDetails", items.id)}
          >
            <View
              style={{
                borderBottomRightRadius: 20,
                borderTopLeftRadius: 20,
                backgroundColor: "white",
                flexDirection: "row",
                margin: 5,
              }}
            >
              <RemoteImage2
                resizeMethod="auto"
                resizeMode="stretch"
                uri={items.key.Image}
                desiredWidth={100}
              />

              <View
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  left: 10,
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
                  UGX {items.key.Price}
                </Text>
              </View>

              {category == "Recommended" ? (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 110,
                  }}
                >
                  <Rating id={items.id} />
                </View>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  setData(items.key);
                  setDataId(items.id);
                  setAboutVisible(true);
                }}
                style={{
                  position: "absolute",
                  right: 0,
                  backgroundColor: "#0fa614",
                  alignSelf: "center",
                  width: 80,
                  alignItems: "center",
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  padding: 5,
                }}
              >
                <Icon
                  name="add-shopping-cart"
                  size={25}
                  style={{ color: "white" }}
                />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
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
          <View>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <RemoteImage
                resizeMethod="auto"
                resizeMode="stretch"
                uri={data.Image}
                desiredWidth={100}
              />
              <View style={{ alignSelf: "center", marginLeft: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: "700" }}>
                  {data.Name}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "400" }}>
                  {data.Category}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: "700", fontSize: 17 }}>Price</Text>
                <Text style={{ fontWeight: "700", fontSize: 25 }}>
                  UGX {getFinal()}
                </Text>
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

              <TouchableOpacity onPress={() => AddToCart(data)}>
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
      </View>
    );
  }

  function AddToCart() {
    let isValid = true;
    const itemsRef2 = ref(db, "Cart/" + user.uid + "/");

    get(itemsRef2).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          let dataVal = child.val();

          if (dataVal.id == dataId) {
            isValid = false;
          } else {
            isValid = true;
          }
        });
      } else {
        isValid = true;
      }
    });

    if (isValid) {
      const itemsRef = push(ref(db, "Cart/" + user.uid));
      set(itemsRef, {
        id: dataId,
        Name: data.Name,
        Image: data.Image,
        Category: data.Category,
        Price: getFinal(),
        Quantity: numberValue,
      })
        .then(() => {
          showToast("Item Added Succesfully");
          setNumber(1);
          setAboutVisible(false);
        })
        .catch((error) => showToast("Error while Adding " + error));
    } else {
      showToast("Product already Exists!..");
      navigation.navigate("Cart");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
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

            <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 20 }}>
              {category}
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 5 }}
          >
            <View
              style={{
                borderRadius: 20,
                backgroundColor: "white",
                padding: 10,
                margin: 10,
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
              }}
            >
              <Icon name="search" size={25} />
              <TextInput
                placeholder="Search Glocery"
                onChangeText={(text) => searchFilterFunction(text)}
                value={search}
                underlineColorAndroid="transparent"
                style={{ width: "80%", marginLeft: 10 }}
              />
            </View>
            <TouchableOpacity
              onPress={() => searchFilterFunction2("Price")}
              style={{
                backgroundColor: "#0fa614",
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <View>
                <Icon
                  name="filter-list"
                  size={20}
                  style={{
                    alignSelf: "center",
                    color: "white",
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ShowAll />
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
