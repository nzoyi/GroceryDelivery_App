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
import { auth, firebase, storage, storageRef } from "../Connection/firebaseDB";
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
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from "react-native-paper";
import { get, ref, set } from "firebase/database";
import { getDownloadURL, uploadBytes } from "firebase/storage";

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
  const [newAddress2, setNewAddress2] = useState("");
  const [newAddress3, setNewAddress3] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [loading, setLoading] = React.useState(false);

  const itemsRef4 = ref(db, "UserAccounts/" + user.uid);

  function userInfo() {
    let isMounted = true;
    get(itemsRef4).then((snapshot) => {
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

  const itemsRef = ref(db, "UserAccounts/" + user.uid + "/Orders/");

  function userInfo2() {
    let isMounted = true;
    get(itemsRef).then((snapshot) => {
      if (isMounted) {
        let total1 = 0;
        total1 += snapshot.numChildren();

        setNumber1(total1);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  const [number2, setNumber2] = useState();

  const itemsRef2 = ref(db, "UserAccounts/" + user.uid + "/Coupons/");

  function userInfo3() {
    let isMounted = true;
    itemsRef2.on("value").then((snapshot) => {
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

  const [selectedImage, setSelectedImage] = useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (pickerResult.cancelled === true) {
      return;
    }

    uploadImage(pickerResult.uri);
    setSelectedImage({ localUri: pickerResult.uri });
  };

  const uploadImage = async (uri) => {
    setLoading(true);
    const response = await fetch(uri);
    const blob = await response.blob();

    const refData = storageRef(storage, "profiles/" + filename);

    uploadBytes(refData, blob).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const itemUpload2 = ref(db, "/UserAccounts/" + user.uid);

        set(itemUpload2, { Profile: url }).then(() => {
          showToast("Uploaded Successfully");
          setLoading(false);
        });
      });
    });
  };

  const RemoteImage = ({ uri, desiredWidth }) => {
    const [desiredHeight, setDesiredHeight] = React.useState(0);

    Image.getSize(uri).then((width, height) => {
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

            <Text style={styles2.modalText}>Location Settings</Text>
            <View></View>
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "500" }}>Country</Text>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>
                {address1}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "500" }}>City</Text>
              <View
                style={{
                  backgroundColor: "#e8edec",
                  padding: 5,
                  borderRadius: 5,
                }}
              >
                <TextInput
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                    width: 150,
                    textAlign: "right",
                  }}
                  placeholder={address2}
                  placeholderTextColor="grey"
                  onChangeText={(text) => setNewAddress2(text)}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "500" }}>
                Local Address
              </Text>
              <View
                style={{
                  backgroundColor: "#e8edec",
                  padding: 5,
                  borderRadius: 5,
                }}
              >
                <TextInput
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                    width: 150,
                    textAlign: "right",
                  }}
                  placeholder={address3}
                  placeholderTextColor="grey"
                  onChangeText={(text) => setNewAddress3(text)}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "500" }}>Contact</Text>
              <View
                style={{
                  backgroundColor: "#e8edec",
                  padding: 5,
                  borderRadius: 5,
                }}
              >
                <TextInput
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                    width: 150,
                    textAlign: "right",
                  }}
                  placeholder={"" + phone}
                  placeholderTextColor="grey"
                  onChangeText={(text) => setNewAddress2(text)}
                />
              </View>
            </View>

            <TouchableOpacity onPress={() => SaveData()}>
              <View
                style={{
                  backgroundColor: "green",
                  padding: 5,
                  borderRadius: 10,
                  margin: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  UPDATE
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function SaveData() {
    let isValid = true;

    if (newAddress2.length > 0) {
      const itemsRef2 = ref(db, "UserAccounts/" + user.uid);

      set(itemsRef2, { City: newAddress2 })
        .then(() => {
          isValid = true;
        })
        .catch((error) => showToast("Error" + error));
    }

    if (newAddress3.length > 0) {
      const itemsRef2 = ref(db, "UserAccounts/" + user.uid);
      set(itemsRef2, { Locale: newAddress3 })
        .then(() => {
          isValid = true;
        })
        .catch((error) => showToast("Error" + error));
    }

    if (newPhone.length > 0) {
      const itemsRef2 = ref(db, "UserAccounts/" + user.uid);

      set(itemsRef2, { Contact: "" + newPhone })
        .then(() => {
          isValid = true;
        })
        .catch((error) => showToast("Error" + error));
    }

    if (isValid) {
      showToast("Update Successful");
      setAboutVisible(false);
    }
  }

  const Loader = ({ visible = false }) => {
    return (
      visible && (
        <View
          style={{
            position: "absolute",
            right: 10,
            marginTop: 10,
            marginLeft: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ActivityIndicator
              size="small"
              animating={true}
              color={COLORS.blue}
            />
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Uploading...</Text>
          </View>
        </View>
      )
    );
  };

  const handleSignOut = () => {
    try {
      auth
        .signOut()
        .then(() => {
          navigation.replace("Login");
        })
        .catch((error) => alert(error.message));
    } catch {
      (error) => console.log("Error " + error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ImageBackground
          blurRadius={10}
          source={{
            uri: userImage
              ? userImage
              : "https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png",
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
            borderRadius: 20,
            backgroundColor: "white",
            elevation: 10,
          }}
        >
          <View>
            <Loader visible={loading} />
            <RemoteImage
              resizeMethod="auto"
              resizeMode="stretch"
              uri={
                userImage
                  ? userImage
                  : "https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"
              }
              desiredWidth={100}
            />
            <TouchableOpacity
              onPress={() => openImagePickerAsync()}
              style={{
                alignSelf: "center",
                position: "absolute",
              }}
            >
              <Icon
                name="add-circle"
                size={30}
                style={{
                  color: "red",
                  elevation: 10,
                }}
              />
            </TouchableOpacity>
          </View>

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
                  justifyContent: "space-evenly",
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
                    minWidth: 120,
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
                  <TouchableOpacity onPress={() => setAboutVisible(true)}>
                    <Text
                      style={{ fontSize: 20, fontWeight: "800", color: "blue" }}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
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

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "800" }}>
                    Contact
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: "800" }}>
                    {phone}
                  </Text>
                </View>
                <TouchableWithoutFeedback onPress={() => handleSignOut()}>
                  <View
                    style={{
                      alignSelf: "center",
                      marginTop: 30,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{ fontSize: 20, fontWeight: "800", color: "red" }}
                    >
                      Logout
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
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
