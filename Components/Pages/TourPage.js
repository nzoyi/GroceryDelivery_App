import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  AppState,
  BackHandler,
  TouchableWithoutFeedback,
  Share,
} from "react-native";
import Constants from "expo-constants";
import COLORS from "../../Colors/Colors";
import { Image } from "react-native";
import { auth, firebase } from "../Connection/firebaseDB";
// Using DB Reference
import { db } from "../Connection/firebaseDB";

import Icon from "react-native-vector-icons/MaterialIcons";

import { Snackbar } from "react-native-paper";

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
import { isValid } from "date-fns";

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

export default function TourPage({ navigation }) {
  function handleBackButtonClick() {
    navigation.replace("Login");
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

  const [userName, setUsername] = useState("");

  const [snackIsVisible, setSnackIsVisible] = useState(false);

  const [uImage, setUImage] = useState("");

  const [playStore, setPlayStore] = useState("");
  const [appleStore, setAppleStore] = useState("");

  const itemData5 = db.ref("Links");
  function linkData() {
    let isMounted = true;
    itemData5.on("value", (snapshot) => {
      var links = [];
      if (isMounted) {
        let dataSet = snapshot.val();

        setPlayStore(dataSet.PlayStore);
        setAppleStore(dataSet.AppleStore);
      }
    });
    return () => {
      isMounted = false;
    };
  }

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

  const [numProducts, setNumProducts] = useState("");

  useEffect(() => {
    ItemImages();
    ItemImages2();
    linkData();
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
      id: "Grains",
      value: "Grains",
    },
    {
      id: "Fruits",
      value: "Fruits",
    },
    {
      id: "Protein Foods",
      value: "Protein Foods",
    },
    {
      id: "Dairy",
      value: "Dairy",
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
  var myArray2 = ["Refer"];

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

  const [newName2, setnewName2] = useState("");

  const shuffle2 = useCallback(() => {
    const index = Math.floor(Math.random() * myArray2.length);
    setnewName2(myArray2[index]);
  }, []);

  useEffect(() => {
    const intervalID = setInterval(shuffle2, 20000);
    return () => clearInterval(intervalID);
  }, [shuffle2]);

  function checkState(id) {
    //console.log(id);
    if (clicked == "All") {
      setClicked(id);
      setShowSelection(false);
      setLoadAll(true);
    } else {
      setClicked(id);
      setShowSelection(true);
      setLoadAll(false);
    }
  }

  const [aboutVisible, setAboutVisible] = useState(false);

  const toggleBottom = () => {
    setAboutVisible(!aboutVisible);
  };

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState("");
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
                  checkState(item.id);
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
                    fontSize: 10,
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
                  checkState(item.id);
                }}
              >
                <Text
                  key={index}
                  style={{
                    color: "#464a4a",
                    fontSize: 16,
                    margin: 10,
                    color: "white",
                  }}
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
          <Text
            style={{
              marginLeft: 10,
              fontSize: 18,
              fontWeight: "700",
              color: "white",
            }}
          >
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
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    setSnackIsVisible(true);
                  }}
                >
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

                    <View style={{ marginTop: 10, padding: 5 }}>
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
                        onPress={() => {
                          setData(items.key);
                          setDataId(items.id);
                          setAboutVisible(true);
                        }}
                        style={{
                          position: "absolute",
                          alignSelf: "flex-end",
                          backgroundColor: "#0fa614",
                          width: 40,
                          alignItems: "flex-end",
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
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    setSnackIsVisible(true);
                  }}
                >
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
                      onPress={() => {
                        setData(items.key);
                        setDataId(items.id);
                        setAboutVisible(true);
                      }}
                      style={{
                        position: "absolute",
                        alignSelf: "flex-end",
                        backgroundColor: "#0fa614",
                        width: 40,
                        alignItems: "flex-end",
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        padding: 5,
                      }}
                    >
                      <Icon
                        name="add-shopping-cart"
                        size={25}
                        style={{ color: "white" }}
                      />
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
      return itemData.indexOf("Grains") > -1;
    });
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {newData2
            .map((items, index) => {
              return index < 6 ? (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    setSnackIsVisible(true);
                  }}
                >
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

                    <View style={{ marginTop: 10, padding: 5 }}>
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
                        onPress={() => {
                          setData(items.key);
                          setDataId(items.id);
                          setAboutVisible(true);
                        }}
                        style={{
                          position: "absolute",
                          alignSelf: "flex-end",
                          backgroundColor: "#0fa614",
                          width: 40,
                          alignItems: "flex-end",
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
                  </View>
                </TouchableWithoutFeedback>
              ) : null;
            })
            .filter((x) => x)}
        </ScrollView>
      </View>
    );
  };

  const LoadList4 = () => {
    const newData = itemArray.sort((a, b) => b.key.Price - a.key.Price);

    const newData2 = newData.filter(function (item) {
      const itemData = item.key.Category ? item.key.Category : "";
      return itemData.indexOf("Vegetables") > -1;
    });
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {newData2
            .map((items, index) => {
              return index < 5 ? (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    setSnackIsVisible(true);
                  }}
                >
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

                    <View style={{ marginTop: 10, padding: 5 }}>
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
                        onPress={() => {
                          setData(items.key);
                          setDataId(items.id);
                          setAboutVisible(true);
                        }}
                        style={{
                          position: "absolute",
                          alignSelf: "flex-end",
                          backgroundColor: "#0fa614",
                          width: 40,
                          alignItems: "flex-end",
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
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                marginLeft: 10,
                color: "white",
              }}
            >
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
                height: 180,
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
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                marginLeft: 10,
                color: "white",
              }}
            >
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
                height: 180,
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
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                marginLeft: 10,
                color: "white",
              }}
            >
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
                height: 180,
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
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                marginLeft: 10,
                color: "white",
              }}
            >
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
                height: 180,
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
                boost Immunity and Sexual Energy
              </Text>
            </View>
          </View>
        </View>
      );
    }
  };

  const LoadTips2 = () => {
    if (newName2 == "Refer") {
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                marginLeft: 10,
                color: "white",
              }}
            >
              Boost Appetite
            </Text>
          </View>
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
            <Image
              source={require("../../assets/discount-Coupon.jpg")}
              borderTopLeftRadius={10}
              borderBottomLeftRadius={10}
              resizeMode="center"
              style={{
                borderWidth: 1,
                width: 150,
                height: 180,
              }}
            />
            <View style={{ margin: 10, flex: 1 }}>
              <Text
                style={{
                  color: "red",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                REFER & EARN
              </Text>
              <Text
                style={{
                  color: "black",
                  fontSize: 18,
                  fontWeight: "400",
                }}
              >
                Refer a minimum of 5 people to City Foods App and earn your self
                a 10% off coupon for 10 products you order.
              </Text>
              <TouchableOpacity
                onPress={() => onShare()}
                style={{
                  backgroundColor: "green",
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
                  INVITE NOW
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else if (newName2 == "Wallet") {
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                marginLeft: 10,
                color: "white",
              }}
            >
              Boost Appetite
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#07a5b8",
              borderRadius: 10,
              minHeight: 100,
              elevation: 5,
              margin: 5,
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../../assets/digital_wallet.jpg")}
              borderTopLeftRadius={10}
              borderBottomLeftRadius={10}
              style={{
                borderWidth: 1,
                width: 150,
                height: 180,
              }}
            />
            <View style={{ margin: 10, flex: 1 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                WALLET
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "400",
                }}
              >
                Create a Wallet! Make Payments Easy on the Go. Deposit and Let
                your wallet do the shopping for you. Get 5% Off with a Wallet
                Payment.
              </Text>
              <TouchableOpacity
                onPress={() => setSnackIsVisible(true)}
                style={{
                  backgroundColor: "#e8b20e",
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
                  GET WALLET
                </Text>
              </TouchableOpacity>
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
            <TouchableWithoutFeedback
              key={index}
              onPress={() => {
                setSnackIsVisible(true);
              }}
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
        </ScrollView>
      </View>
    );
  };

  const LoadAll = () => {
    return (
      <View>
        <View style={{ marginTop: 10 }}>{<LoadTips2 />}</View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              marginLeft: 10,
              color: "white",
            }}
          >
            Recommended
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AllProducts", "Recommended")}
          >
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
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                marginLeft: 10,
                color: "white",
              }}
            >
              Fruits
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AllProducts", "Fruits")}
            >
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

        <View style={{ marginTop: 10 }}>{<LoadTips />}</View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                marginLeft: 10,
                color: "white",
              }}
            >
              Grains
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AllProducts", "Grains")}
            >
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

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                marginLeft: 10,
                color: "white",
              }}
            >
              Vegetables
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AllProducts", "Vegetables")}
            >
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
          <LoadList4 />
        </View>
      </View>
    );
  };

  const LoadSearch = () => {
    return (
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredDataSource.map((items, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => {
                setSnackIsVisible(true);
              }}
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
        </ScrollView>
      </View>
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
    setAboutVisible(false);
    setSnackIsVisible(true);
  }

  const onShare = async () => {
    let link;
    if (Platform.OS === "android") {
      link = playStore;
    } else {
      link = appleStore;
    }

    try {
      const result = await Share.share({
        message:
          "Hi there 👋, Have you yet used this App to make Grocery 🍓🛍️ Shopping 🛍️🍍 ⁉️ Check it out now by clicking this link " +
          link,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const [fav, setFav] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              marginTop: 10,
            }}
          >
            <View style={{ margin: 5 }}>
              <Text style={{ fontSize: 15, fontWeight: "300", color: "white" }}>
                Welcome
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>
                Friend
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                source={require("../../assets/monkey.png")}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
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
          <TouchableOpacity onPress={() => navigation.replace("TourPage")}>
            <Icon name="home" size={30} style={{ color: "#0fa614" }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSnackIsVisible(true);
            }}
          >
            <Icon name="search" size={30} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSnackIsVisible(true);
            }}
          >
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

          <TouchableWithoutFeedback
            onPress={() => {
              setSnackIsVisible(true);
            }}
          >
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
          </TouchableWithoutFeedback>
          <TouchableOpacity
            onPress={() => {
              setSnackIsVisible(true);
            }}
          >
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

        <Snackbar
          visible={snackIsVisible}
          onDismiss={() => setSnackIsVisible(false)}
          action={{
            label: "Okay",
            onPress: () => {
              navigation.navigate("Login");
              setSnackIsVisible(false);
            },
          }}
          style={{ backgroundColor: "black" }}
        >
          <View>
            <Text style={{ color: "white" }}>
              Hey there! You need to login first to get this feature!
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
