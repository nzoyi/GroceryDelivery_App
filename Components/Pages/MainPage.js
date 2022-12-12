import React, { useState, useEffect, useRef } from "react";
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
import Rating from "./Rating";

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

export default function MainPage({ navigation }) {
  function handleBackButtonClick() {
    //navigation.replace("MainPage");
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

  const [itemArray, setItemArray] = useState([]);
  const [itemArray2, setItemArray2] = useState([]);

  const itemsRef2 = db.ref("ItemsList/");

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

  const itemsRef = db.ref("ItemsList/");

  function ItemImages2() {
    let isMounted = true;
    itemsRef.on("value", (snapshot) => {
      if (isMounted) {
        var itemArray2 = [];
        snapshot.forEach((child) => {
          let dataVal = child.val();
          if (child.child("Rating").exists()) {
            console.log("true");
          } else {
            console.log("false");
          }
        });
        setItemArray2(itemArray2);
        //console.log(itemArray2);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    ItemImages();
    ItemImages2();
  }, []);

  let arry = [
    {
      id: "All",
      value: "All",
    },
    {
      id: "Vegetables",
      value: "Vegetables",
    },
    {
      id: "Cereals",
      value: "Cereals",
    },
    {
      id: "Fruits",
      value: "Fruits",
    },
    {
      id: "Berry",
      value: "Berry",
    },
    {
      id: "Diary",
      value: "Diary",
    },
  ];

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

  const [clicked, setClicked] = useState("All");

  const LoadCategory = () => {
    return (
      <View style={{ alignSelf: "center" }}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {arry.map((item, index) =>
            clicked == item.id ? (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setClicked(item.id);
                }}
              >
                <Text
                  style={{
                    color: "#0fd93e",
                    textTransform: "uppercase",
                    fontSize: 18,
                    alignItems: "center",
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 10,
                  }}
                >
                  {item.value}
                </Text>
                <Text
                  style={{
                    color: "#0fd93e",
                    textTransform: "uppercase",
                    fontSize: 18,
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  🟢
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setClicked(item.id);
                }}
              >
                <Text
                  key={index}
                  style={{ color: "#464a4a", fontSize: 16, margin: 10 }}
                >
                  {item.value}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>
    );
  };

  const LoadList = () => {
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {itemArray
            .map(function (items, index) {
              return index < 6 ? (
                <TouchableOpacity key={index}>
                  <View
                    style={{
                      borderRadius: 20,
                      backgroundColor: "white",
                      margin: 5,
                    }}
                  >
                    <RemoteImage
                      resizeMethod="auto"
                      resizeMode="stretch"
                      uri={items.key.Image}
                      desiredWidth={200}
                    />

                    <View style={{ marginTop: 10 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          marginLeft: 10,
                        }}
                      >
                        {items.key.Name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "300",
                          marginLeft: 10,
                        }}
                      >
                        {items.key.Category}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "300",
                          marginLeft: 10,
                          color: "green",
                        }}
                      >
                        UGX {items.key.Price}
                      </Text>
                      <Rating id={items.id} />
                      <View
                        style={{
                          position: "absolute",
                          alignSelf: "flex-end",
                          backgroundColor: "orange",
                          width: 40,
                          alignItems: "flex-end",
                          borderTopLeftRadius: 10,
                          borderBottomLeftRadius: 10,
                          padding: 5,
                        }}
                      >
                        <Icon name="add-shopping-cart" size={25} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null;
            })
            .filter((x) => x)}
        </ScrollView>
      </View>
    );
  };

  const LoadList2 = () => {
    const newData = itemArray.sort((a, b) => b.key.Price - a.key.Price);

    const newData2 = newData.filter(function (item) {
      const itemData = item.key.Category ? item.key.Category : "";
      return itemData.indexOf("Fruits") > -1;
    });

    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {newData2
            .map((items, index) => {
              return index < 6 ? (
                <TouchableOpacity key={index}>
                  <View
                    style={{
                      borderBottomRightRadius: 20,
                      borderTopLeftRadius: 20,
                      backgroundColor: "white",
                      flexDirection: "row",
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

                    <View
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
                    </View>

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
                        UGX {items.key.Price}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null;
            })
            .filter((x) => x)}
        </ScrollView>
      </View>
    );
  };

  const LoadList3 = () => {
    const newData = itemArray.sort((a, b) => b.key.Price - a.key.Price);

    const newData2 = newData.filter(function (item) {
      const itemData = item.key.Category ? item.key.Category : "";
      return itemData.indexOf("Cereals") > -1;
    });
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {newData2
            .map((items, index) => {
              return index < 6 ? (
                <TouchableOpacity key={index}>
                  <View
                    style={{
                      borderRadius: 20,
                      backgroundColor: "white",
                      margin: 5,
                    }}
                  >
                    <RemoteImage
                      resizeMethod="auto"
                      resizeMode="stretch"
                      uri={items.key.Image}
                      desiredWidth={200}
                    />

                    <View style={{ marginTop: 10 }}>
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
                      <View
                        style={{
                          position: "absolute",
                          alignSelf: "flex-end",
                          backgroundColor: "orange",
                          width: 40,
                          alignItems: "flex-end",
                          borderTopLeftRadius: 10,
                          borderBottomLeftRadius: 10,
                          padding: 5,
                        }}
                      >
                        <Icon name="add-shopping-cart" size={25} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null;
            })
            .filter((x) => x)}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <View style={{ margin: 5 }}>
            <Text style={{ fontSize: 25, fontWeight: "800" }}>Welcome</Text>
            <Text>IBRAHIM MASEMBE</Text>
          </View>
          <Image
            source={require("../../assets/monkey.png")}
            style={{ width: 50, height: 50 }}
          />
        </View>
        <View
          style={{
            borderRadius: 20,
            backgroundColor: "white",
            padding: 10,
            margin: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Icon name="search" size={25} />
          <TextInput
            placeholder="Search Glocery"
            style={{ width: "80%", marginLeft: 10 }}
          />
        </View>

        <View style={{ height: 50 }}>
          <LoadCategory />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", marginLeft: 10 }}>
              Rated
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  marginRight: 10,
                  color: "green",
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <LoadList />
          </View>

          <View style={{ marginTop: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18, fontWeight: "800", marginLeft: 10 }}>
                Recommended
              </Text>
              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "800",
                    marginRight: 10,
                    color: "green",
                  }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <LoadList2 />
          </View>

          <View style={{ marginTop: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18, fontWeight: "800", marginLeft: 10 }}>
                Cereals
              </Text>
              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "800",
                    marginRight: 10,
                    color: "green",
                  }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <LoadList3 />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8eaed",
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
