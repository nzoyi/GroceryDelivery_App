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
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
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
            itemArray2.push({
              id: child.key,
              key: child.val(),
            });
          } else {
            //console.log("false");
          }
        });
        setItemArray2(itemArray2);
        setLoading(false);
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
  const [showSelection, setShowSelection] = useState(false);
  const [loadAll, setLoadAll] = useState(true);
  var myArray = ["Women", "Men", "Kids", "Pregnant"];

  var randomItem = myArray[Math.floor(Math.random() * myArray.length)];
  const [newName, setnewName] = useState("");

  const shuffle = useCallback(() => {
    const index = Math.floor(Math.random() * myArray.length);
    setnewName(myArray[index]);
  }, []);

  useEffect(() => {
    const intervalID = setInterval(shuffle, 20000);
    return () => clearInterval(intervalID);
  }, [shuffle]);

  function checkState() {
    if (clicked == "All") {
      setShowSelection(false);
      setLoadAll(true);
    } else {
      setShowSelection(true);
      setLoadAll(false);
    }
  }

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = itemArray.filter(function (item) {
        const itemData = item.key.Name ? item.key.Name : "";
        return itemData.indexOf(text) > -1;
      });

      if (clicked == "All") {
        setFilteredDataSource(newData);
      } else {
        const newData2 = newData.filter(function (item) {
          const itemData = item.key.Category ? item.key.Category : "";
          return itemData.indexOf(clicked) > -1;
        });
        setFilteredDataSource(newData2);
      }

      setSearch(text);
      setShowSearch(true);
      setShowSelection(false);
      setLoadAll(false);
    } else {
      setFilteredDataSource(itemArray);
      setSearch(text);
      if (clicked == "All") {
        setShowSearch(false);
        setShowSelection(false);
        setLoadAll(true);
      } else {
        setShowSearch(false);
        setShowSelection(true);
        setLoadAll(false);
      }
    }
  };

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
                  checkState();
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
                  checkState();
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

  //Show Indicator
  const Loader = ({ visible = true }) => {
    return (
      visible && (
        <View
          style={{
            marginHorizontal: 50,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <ActivityIndicator
            size="small"
            animating={true}
            color={COLORS.blue}
          />
          <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "700" }}>
            Loading Data...
          </Text>
        </View>
      )
    );
  };

  const LoadList = () => {
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {itemArray2
            .map(function (items, index) {
              return index < 6 ? (
                <TouchableWithoutFeedback key={index}>
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
                      <TouchableOpacity
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
                      </TouchableOpacity>
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
                <TouchableWithoutFeedback key={index}>
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
                        UGX {items.key.Price}
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
                <TouchableWithoutFeedback key={index}>
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
                      <TouchableOpacity
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
                      </TouchableOpacity>
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

  //Tips
  const LoadTips = () => {
    if (newName == "Women") {
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", marginLeft: 10 }}>
              Health Tips
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#eb0eac",
              borderRadius: 10,
              minHeight: 100,
              elevation: 5,
              margin: 5,
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../../assets/women_pc.jpg")}
              borderTopLeftRadius={10}
              borderBottomLeftRadius={10}
              style={{
                borderWidth: 1,
                width: 150,
                height: 150,
              }}
            />
            <View style={{ margin: 10, alignSelf: "center", flex: 1 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                HEALTHY DIET{"(WOMEN)"}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "400",
                }}
              >
                lots of fruits, vegetables, nuts, seeds, whole grains, and
                healthy fats such as olive oil
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (newName == "Pregnant") {
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", marginLeft: 10 }}>
              Health Tips
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "green",
              borderRadius: 10,
              minHeight: 100,
              elevation: 5,
              margin: 5,
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../../assets/pregnant_pc.jpg")}
              borderTopLeftRadius={10}
              borderBottomLeftRadius={10}
              style={{
                borderWidth: 1,
                width: 150,
                height: 150,
              }}
            />
            <View style={{ margin: 10, alignSelf: "center", flex: 1 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                HEALTHY DIET{"(PREGNANT WOMEN)"}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "400",
                }}
              >
                beans. pulses. fish. eggs. meat {"(but avoid liver)"}
                poultry. nuts.
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (newName == "Kids") {
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", marginLeft: 10 }}>
              Health Tips
            </Text>
          </View>
          <View
            style={{
              backgroundColor: COLORS.purple,
              borderRadius: 10,
              minHeight: 100,
              elevation: 5,
              margin: 5,
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../../assets/kids_pc.jpg")}
              borderTopLeftRadius={10}
              borderBottomLeftRadius={10}
              style={{
                borderWidth: 1,
                width: 150,
                height: 150,
              }}
            />
            <View style={{ margin: 10, alignSelf: "center", flex: 1 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                HEALTHY DIET{"(KIDS)"}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "400",
                }}
              >
                Cauliflower 'nachos' with cucumber salsa · Vegetable fried rice
                with egg ribbons · Fish nuggets with avocado and pea dip
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (newName == "Men") {
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", marginLeft: 10 }}>
              Health Tips
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "teal",
              borderRadius: 10,
              minHeight: 100,
              elevation: 5,
              margin: 5,
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../../assets/men_pc.jpg")}
              borderTopLeftRadius={10}
              borderBottomLeftRadius={10}
              style={{
                borderWidth: 1,
                width: 150,
                height: 150,
              }}
            />
            <View style={{ margin: 10, alignSelf: "center", flex: 1 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                HEALTHY DIET{"(MEN)"}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "400",
                }}
              >
                Lean ham, fish like salmon or haddock, as well as lower fat
                dairy or dairy-free alternatives, Gnuts, Water Melons etc. To
                boost Immuity and Sexual Energy
              </Text>
            </View>
          </View>
        </View>
      );
    }
  };

  //Load Selection
  const LoadSelection = ({ id }) => {
    const newData = itemArray.sort((a, b) => b.key.Price - a.key.Price);

    const newData2 = newData.filter(function (item) {
      const itemData = item.key.Category ? item.key.Category : "";
      return itemData.indexOf(id) > -1;
    });

    return (
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {newData2.map((items, index) => (
            <TouchableWithoutFeedback key={index}>
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
                  style={{
                    position: "absolute",
                    right: 0,
                    backgroundColor: "orange",
                    alignSelf: "center",
                    width: 80,
                    alignItems: "center",
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    padding: 5,
                  }}
                >
                  <Icon name="add-shopping-cart" size={25} />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      </View>
    );
  };

  const LoadAll = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
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
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
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
          <LoadTips />
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
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
      </View>
    );
  };

  const LoadSearch = () => {
    return (
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredDataSource.map((items, index) => (
            <TouchableWithoutFeedback key={index}>
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
                  style={{
                    position: "absolute",
                    right: 0,
                    backgroundColor: "orange",
                    alignSelf: "center",
                    width: 80,
                    alignItems: "center",
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    padding: 5,
                  }}
                >
                  <Icon name="add-shopping-cart" size={25} />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          ))}
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
            <Text style={{ fontSize: 15, fontWeight: "300" }}>Welcome</Text>
            <Text style={{ fontSize: 20, fontWeight: "800" }}>
              IBRAHIM MASEMBE
            </Text>
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
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
            style={{ width: "80%", marginLeft: 10 }}
          />
        </View>

        <View style={{ height: 50 }}>
          <LoadCategory />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {loading ? (
            <Loader visible={loading} />
          ) : showSelection ? (
            clicked !== "All" ? (
              <LoadSelection id={clicked} />
            ) : (
              <LoadAll />
            )
          ) : loadAll ? (
            <LoadAll />
          ) : showSearch ? (
            <LoadSearch />
          ) : null}
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
