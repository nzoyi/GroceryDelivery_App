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
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native";
import { equalTo, get, orderByKey, query, ref } from "firebase/database";

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

export default function Favorite({ navigation }) {
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

  const itemsRef2 = ref(db, "UserAccounts/" + user.uid + "/Favorite/");

  function ItemImages() {
    let isMounted = true;
    get(itemsRef2).then((snapshot) => {
      if (isMounted) {
        var itemArray = [];

        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            let dataVal = child.val();

            const itemsRef = query(
              ref(db, "ItemsList/"),
              orderByKey(),
              equalTo(dataVal.id)
            );

            get(itemsRef).then((snapshot) => {
              snapshot.forEach((child) => {
                itemArray.push({
                  id: child.key,
                  key: child.val(),
                });

                //console.log(child.val());
                setItemArray(itemArray);
                setFilteredDataSource(itemArray);
              });
            });
          });
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }

  const [numProducts, setNumProducts] = useState("");

  const itemsRef3 = ref(db, "Cart/" + user.uid);

  function itemCart() {
    let isMounted = true;
    get(itemsRef2).then((snapshot) => {
      if (isMounted) {
        let total1 = 0;
        total1 += snapshot.numChildren();

        setNumProducts(total1);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  const [userName, setUsername] = useState("");
  const [uImage, setUImage] = useState("");

  const userRef = ref(db, "UserAccounts/" + user.uid);
  function getUserData() {
    let isMounted = true;
    get(userRef).then((snapshot) => {
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
    ItemImages();
    itemCart();
    getUserData();
  }, []);

  const [search, setSearch] = useState("");

  const [filteredDataSource, setFilteredDataSource] = useState([]);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = filteredDataSource.filter(function (item) {
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

  function setFavorite(pId) {
    let isValid = true;
    const itemsRef = ref(db, "UserAccounts/" + user.uid + "/Favorite/" + pId);
    itemsRef.remove();
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

              <TouchableOpacity
                onPress={() => {
                  setFavorite(items.id);
                }}
                style={{
                  position: "absolute",
                  right: 0,
                  backgroundColor: "red",
                  alignSelf: "center",
                  width: 80,
                  alignItems: "center",
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  padding: 5,
                }}
              >
                <Icon name="favorite" size={25} style={{ color: "white" }} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    );
  };

  const [fav, setFav] = useState(false);

  useEffect(() => {
    const itemsRef3 = ref(db, "UserAccounts/" + user.uid + "/Favorite/");
    itemsRef3.on("value").then((snapshot) => {
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
          {
            //Body
          }
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
              <Text
                style={{ textAlign: "center", fontSize: 20, color: "white" }}
              >
                No Favorites Available
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("MainPage")}>
                <Text
                  style={{ textAlign: "center", fontSize: 20, color: "green" }}
                >
                  Add Products
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <ShowAll />
            </ScrollView>
          )}
        </View>

        {
          //Footer
        }
        <View
          style={{
            padding: 10,
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "space-evenly",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            alignItems: "center",
            height: 60,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("MainPage")}>
            <Icon name="home" size={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("SearchPage")}>
            <Icon name="search" size={30} />
          </TouchableOpacity>

          {fav == true ? (
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("Favorite")}
            >
              <View
                style={{
                  padding: 5,
                  bottom: 20,
                  height: 60,
                  width: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "red",
                  borderRadius: 20,
                  borderWidth: 5,
                  borderColor: "white",
                }}
              >
                <Icon
                  name="favorite"
                  size={40}
                  style={{
                    color: "white",
                    alignSelf: "center",
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate("Favorite")}>
              <View
                style={{
                  padding: 5,
                  bottom: 20,
                  height: 60,
                  width: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#0fa614",
                  borderRadius: 20,
                  borderWidth: 5,
                  borderColor: "white",
                }}
              >
                <Icon
                  name="favorite"
                  size={40}
                  style={{
                    color: "white",
                    alignSelf: "center",
                  }}
                />
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
            <View>
              <Icon name="shopping-cart" size={30} />
              {numProducts ? (
                <Text
                  style={{
                    backgroundColor: "red",
                    borderRadius: 10,
                    width: 20,
                    padding: 5,
                    position: "absolute",
                    fontSize: 12,
                    color: "white",
                    left: 15,
                    bottom: 15,
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  {numProducts}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            {uImage ? (
              <Image
                source={{ uri: uImage }}
                style={{ width: 30, height: 30, borderRadius: 20 }}
              />
            ) : (
              <Image
                source={require("../../assets/monkey.png")}
                style={{ width: 30, height: 30 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131414",
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
