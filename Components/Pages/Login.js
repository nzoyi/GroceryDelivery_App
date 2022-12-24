import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  AppState,
  BackHandler,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Constants from "expo-constants";
import Expo from "expo";

import COLORS from "../../Colors/Colors";
import { Image } from "react-native";
import { auth, firebase } from "../Connection/firebaseDB";
// Using DB Reference
import { db } from "../Connection/firebaseDB";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native";
import { CheckBox } from "react-native-elements";
import * as Location from "expo-location";
import { ActivityIndicator, TextInput } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

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

export default function Login({ navigation }) {
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

  const [email, setEmail] = useState([]);
  const phoneInput = useRef(null);
  const [formattedValue, setFormattedValue] = useState("");
  const [terms, setTerms] = useState(false);
  const [TandC, setTandC] = useState("");
  const [phone, setPhone] = useState("");
  const [TermsConditions, setTermsConditions] = useState("");
  const [password, onPassword] = useState([]);
  const [password2, onPassword2] = useState([]);
  const [username, setUsername] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [login, setlogin] = useState(true);

  const getTerms = () => {
    if (terms == true) {
      setTerms(false);
      setTermsConditions("false");
    } else {
      setTerms(true);
      setTermsConditions("True");
    }
  };

  const itemData5 = db.ref("Links");

  useEffect(() => {
    let isMounted = true;
    itemData5.on("value", (snapshot) => {
      var links = [];
      if (isMounted) {
        let dataSet = snapshot.val();

        setTandC(dataSet.TAC);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  function OpenLink() {
    let link = TandC;
    if (link) {
      Linking.openURL(link);
    } else {
      Alert.alert("Terms and Conditions", "link is undefined");
    }
  }

  const handleLogin = () => {
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        const itemsRef1 = db.ref("/UserAccounts/" + user.uid);

        itemsRef1.on("value", (snapshot) => {
          if (snapshot.exists()) {
            navigation.replace("MainPage");
            setLoading(false);
          } else {
            alert("Account doesn't exist");
            setLoading(false);
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        alert("Wrong Email or Password");
      });
  };

  const [loading, setLoading] = React.useState(false);

  const Loader = ({ visible = false }) => {
    return (
      visible && (
        <View
          style={{
            alignSelf: "center",
            padding: 10,
          }}
        >
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
              Please Wait...
            </Text>
          </View>
        </View>
      )
    );
  };

  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Wait, we are fetching you location..."
  );
  const [country, setCountry] = useState("");
  const [iso, setISO] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, []);

  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        "Location Service not enabled",
        "Please enable your location services to continue",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  };

  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use location service.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${item.country}`;
        let address2 = `${item.isoCountryCode}`;
        let address3 = `${item.city}`;

        setCountry(address);
        setISO(address2);
        setCity(address3);
      }
    }
  };

  function handleSignUp() {
    Keyboard.dismiss();
    let isValid = true;

    if (username == "") {
      showToast("Enter Full Name");
      isValid = false;
    }

    if (terms == false) {
      isValid = false;
      showToast("Terms and Conditions must be Checked");
    }

    if (email == "") {
      showToast("Enter Email");
      isValid = false;
    } else {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

      if (email.length === 0) {
        showToast("email address must be enter");
        isValid = false;
      } else if (reg.test(email) === false) {
        showToast("enter valid email address");
        isValid = false;
      }
    }

    if (password == "" || password2 == "") {
      showToast("Enter Password");
      isValid = false;
    }

    if (password !== password2) {
      showToast("Passwords Don't Match");
      isValid = false;
    }

    if (password2.length < 8 || password2.length > 20) {
      showToast("Password should be min 8 char and max 20 char");
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      auth
        .createUserWithEmailAndPassword(email, password2)
        .then((userCredentials) => {
          const user = userCredentials.user;
          const itemUpload = db.ref("/UserAccounts/" + user.uid);
          itemUpload
            .set({
              Name: username,
              Email: email,
              Contact: formattedValue,
              TermsConditions: "" + terms,
              Country: country,
              City: city,
              Locale: city,
              iso: iso.toLowerCase(),
            })
            .then(() => {
              setLoading(false);
              navigation.replace("MainPage");
              user.sendEmailVerification();
              showToast("Email Verification sent");
            });
        })
        .catch((error) => {
          setLoading(false);
          showToast("" + error);
        });
    }
  }

  //google SignUp
  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();
  const [message, setMessage] = useState();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1025016915176-rdodvgkf2q38ep82gmdmq5td2eufero6.apps.googleusercontent.com",
    iosClientId:
      "1025016915176-64c3ave50dosmc9ig8963f0jubtgi6r2.apps.googleusercontent.com",
    expoClientId:
      "1025016915176-5s0bbab2gira435j04khh7bqdauafahq.apps.googleusercontent.com",
  });

  useEffect(() => {
    setMessage(JSON.stringify(response));
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  const Glogin = async () => {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    userInfoResponse.json().then((data) => {
      console.log(data);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={require("../../assets/bg_orange.jpg")}
            blurRadius={10}
            borderBottomRightRadius={200}
            style={{
              backgroundColor: "white",
              borderBottomRightRadius: 200,
              height: 300,
              elevation: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/cityFoods.png")}
              style={{
                width: 150,
                height: 150,
                alignSelf: "center",
                elevation: 10,
              }}
            />
          </ImageBackground>
          <View style={{ marginTop: 10 }}>
            <View style={{ right: 10 }}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "800",
                  alignSelf: "flex-end",
                }}
              >
                WELCOME
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  alignSelf: "flex-end",
                }}
              >
                BACK
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  alignSelf: "flex-end",
                }}
              >
                Let's get started Now
              </Text>
            </View>

            {login ? (
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    alignSelf: "center",
                    marginTop: 20,
                  }}
                >
                  Login
                </Text>
                <View style={styles.searchInputContainer}>
                  <Icon name="email" size={20} style={{ marginLeft: 20 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    keyboardType="email-address"
                    underlineColor="transparent"
                    defaultValue={email}
                    onChangeText={setEmail}
                  />
                </View>
                <View style={styles.searchInputContainer}>
                  <Icon name="lock" size={20} style={{ marginLeft: 20 }} />
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => onPassword(text)}
                    value={password}
                    underlineColor="transparent"
                    maxLength={15}
                    placeholder="Password"
                    secureTextEntry={passwordVisible}
                    right={
                      <TextInput.Icon
                        name={passwordVisible ? "eye" : "eye-off"}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      />
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    handleLogin();
                  }}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#35d3db",
                    borderRadius: 10,
                    padding: 10,
                    width: 200,
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "300",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
                <Loader visible={loading} />
                <Text
                  style={{ alignSelf: "center", fontSize: 17, marginTop: 10 }}
                >
                  ----------OR-----------
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 10,
                    marginTop: 10,
                    justifyContent: "space-evenly",
                  }}
                >
                  <TouchableWithoutFeedback onPress={() => setlogin(false)}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "500",
                        textAlign: "center",
                        color: "blue",
                      }}
                    >
                      Sign Up
                    </Text>
                  </TouchableWithoutFeedback>

                  <View style={styles.verticleLine}></View>

                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate("TourPage")}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "500",
                        textAlign: "center",
                        color: "blue",
                      }}
                    >
                      Take a Tour
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    alignSelf: "center",
                    marginTop: 20,
                  }}
                >
                  Sign Up
                </Text>
                <View style={styles.searchInputContainer}>
                  <Icon
                    name="account-circle"
                    size={20}
                    style={{ marginLeft: 20 }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Full Name"
                    keyboardType="default"
                    underlineColor="transparent"
                    defaultValue={username}
                    onChangeText={setUsername}
                  />
                </View>

                <View style={styles.searchInputContainer}>
                  <Icon name="email" size={20} style={{ marginLeft: 20 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    keyboardType="email-address"
                    underlineColor="transparent"
                    defaultValue={email}
                    onChangeText={setEmail}
                  />
                </View>
                <View style={styles.searchInputContainer2}>
                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={phone}
                    defaultCode="UG"
                    layout="first"
                    onChangeText={(text) => {
                      setPhone(text);
                    }}
                    onChangeFormattedText={(text) => {
                      setFormattedValue(text);
                    }}
                  />
                </View>

                <View style={styles.searchInputContainer}>
                  <Icon name="lock" size={20} style={{ marginLeft: 20 }} />
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => onPassword(text)}
                    value={password}
                    underlineColor="transparent"
                    maxLength={15}
                    placeholder="Password"
                    secureTextEntry={passwordVisible}
                  />
                </View>

                <View style={styles.searchInputContainer}>
                  <Icon name="lock" size={20} style={{ marginLeft: 20 }} />
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => onPassword2(text)}
                    value={password2}
                    underlineColor="transparent"
                    maxLength={15}
                    placeholder="Confirm Password"
                    secureTextEntry={passwordVisible}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    alignItems: "center",
                  }}
                >
                  <CheckBox
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={terms}
                    onPress={getTerms}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      marginLeft: -20,
                    }}
                  >
                    I agree to the
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() => (onPress = { OpenLink })}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: "blue",
                        marginLeft: 5,
                      }}
                    >
                      terms {"&"} Conditions{" "}
                    </Text>
                  </TouchableWithoutFeedback>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    handleSignUp();
                  }}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#35d3db",
                    borderRadius: 10,
                    padding: 10,
                    width: 200,
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "300",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    SignUp
                  </Text>
                </TouchableOpacity>
                <Loader visible={loading} />
                <Text
                  style={{ alignSelf: "center", fontSize: 17, marginTop: 10 }}
                >
                  ----------OR-----------
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 10,
                    marginTop: 10,
                    justifyContent: "space-evenly",
                  }}
                >
                  <TouchableWithoutFeedback onPress={() => setlogin(true)}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "500",
                        textAlign: "center",
                        color: "blue",
                      }}
                    >
                      Login
                    </Text>
                  </TouchableWithoutFeedback>

                  <View style={styles.verticleLine}></View>

                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate("TourPage")}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "500",
                        textAlign: "center",
                        color: "blue",
                      }}
                    >
                      Take a Tour
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            )}
            {/*     <TouchableWithoutFeedback onPress={() => Glogin()}>
              <View
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#248df0",
                  padding: 10,
                  margin: 10,
                  borderRadius: 5,
                }}
              >
                <Icon name="google" size={20} style={{ color: "white" }} />
                <Text style={{ color: "white", marginLeft: 5 }}>
                  Sign in with Google
                </Text>
              </View>
            </TouchableWithoutFeedback> */}

            <Text style={{ alignSelf: "center", marginTop: 50 }}>
              © Future Designs {new Date().getFullYear()}
            </Text>
            <Text
              style={{ alignSelf: "center", marginTop: 10, marginBottom: 30 }}
            >
              Version 1.0.0
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dce1e8",
    flexDirection: "column",
  },
  header: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    elevation: 15,
  },
  searchInputContainer: {
    backgroundColor: "#f9f9f9",
    width: "90%",
    height: 60,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    alignSelf: "center",
  },
  searchInputContainer2: {
    backgroundColor: "#f9f9f9",
    width: "90%",
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    alignSelf: "center",
    justifyContent: "center",
  },
  verticleLine: {
    height: "100%",
    width: 1,
    backgroundColor: "black",
  },
  input: {
    width: "80%",
    marginLeft: 10,
    backgroundColor: "transparent",
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
