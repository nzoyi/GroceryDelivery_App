import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Linking,
  TouchableWithoutFeedback,
  Share,
  Modal,
} from "react-native";
import { Image } from "react-native";
import { auth, firebase } from "../Connection/firebaseDB";
// Using DB Reference
import { db } from "../Connection/firebaseDB";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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

export default function Profile({ navigation, route }) {
  let user = firebase.auth().currentUser;

  if (!user) {
    navigation.replace("Login");
  }

  const [userName, setUsername] = useState("");
  const [uImage, setUImage] = useState("");

  const [snackIsVisible, setSnackIsVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

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

  const [phoneLink, setPhone] = useState("");
  const [playStore, setPlayStore] = useState("");
  const [appleStore, setAppleStore] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [policy, setPolicy] = useState("");
  const [tc, setTC] = useState("");
  const [instagram, setInstagram] = useState("");

  const itemData5 = db.ref("Links");
  function linkData() {
    let isMounted = true;
    itemData5.on("value", (snapshot) => {
      var links = [];
      if (isMounted) {
        let dataSet = snapshot.val();

        setPlayStore(dataSet.PlayStore);
        setAppleStore(dataSet.AppleStore);
        setPhone(dataSet.PhoneLink);
        setFacebook(dataSet.Facebook);
        setTwitter(dataSet.Twitter);
        setInstagram(dataSet.Instagram);
        setPolicy(dataSet.Policy);
        setTC(dataSet.TAC);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    getUserData();
    linkData();
  }, []);

  function RateUs() {
    if (Platform.OS === "android") {
      let link = playStore;
      if (link) {
        Linking.canOpenURL(link)
          .then((supported) => {
            if (!supported) {
              Alert.alert("Please install Google PlayStore to rate us. Thanks");
            } else {
              return Linking.openURL(link);
            }
          })
          .catch((err) => console.error("An error occurred", err));
      } else {
        Alert.alert("Google PlayStore -----> ", "link is undefined");
      }
    } else {
      let link = appleStore;
      if (link) {
        Linking.canOpenURL(link)
          .then((supported) => {
            if (!supported) {
              Alert.alert("Please install Appstore to rate us. Thanks");
            } else {
              return Linking.openURL(link);
            }
          })
          .catch((err) => console.error("An error occurred", err));
      } else {
        Alert.alert("Apple AppStore -----> ", "link is undefined");
      }
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

  const Privacy = () => {
    if (policy) {
      Linking.canOpenURL(policy)
        .then((supported) => {
          if (!supported) {
            Alert.alert("Please install a Browser. Thanks");
          } else {
            return Linking.openURL(policy);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    } else {
      Alert.alert("Browser -----> ", "link is undefined");
    }
  };

  const TC = () => {
    if (tc) {
      Linking.canOpenURL(tc)
        .then((supported) => {
          if (!supported) {
            Alert.alert("Please install a Browser to rate us. Thanks");
          } else {
            return Linking.openURL(tc);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    } else {
      Alert.alert("Browser -----> ", "link is undefined");
    }
  };

  const OpenFacebook = () => {
    if (facebook) {
      Linking.canOpenURL(facebook)
        .then((supported) => {
          if (!supported) {
            Alert.alert("Please install Facebook app. Thanks");
          } else {
            return Linking.openURL(facebook);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    } else {
      Alert.alert("Facebook App-----> ", "link is undefined");
    }
  };

  const OpenInstgram = () => {
    if (instagram) {
      Linking.canOpenURL(instagram)
        .then((supported) => {
          if (!supported) {
            Alert.alert("Please install Instagram app. Thanks");
          } else {
            return Linking.openURL(instagram);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    } else {
      Alert.alert("Instagram App-----> ", "link is undefined");
    }
  };

  const OpenTwitter = () => {
    if (twitter) {
      Linking.canOpenURL(twitter)
        .then((supported) => {
          if (!supported) {
            Alert.alert("Please install Twitter app. Thanks");
          } else {
            return Linking.openURL(twitter);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    } else {
      Alert.alert("Twitter App-----> ", "link is undefined");
    }
  };

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
          "Hi there, Have you yet used this App? Check it out now by clicking this link " +
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

  function customDesign() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
      >
        <View style={{ backgroundColor: "white", borderRadius: 20 }}>
          <View style={styles2.modalView}>
            <View style={{ flexDirection: "row", padding: 5, width: "100%" }}>
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <Icon
                  name="close"
                  size={25}
                  style={{
                    position: "absolute",
                    left: 5,
                    borderRadius: 20,
                    color: "white",
                    backgroundColor: "red",
                  }}
                />
              </TouchableWithoutFeedback>
              <Text style={styles2.modalText}>CITY FOODS</Text>
            </View>

            <View style={{ alignSelf: "center" }}>
              <Text>─────────────────────────</Text>
            </View>
            <Text style={{ textAlign: "center" }}>
              City Foods was founded in 2022 by Future Designs Tech Company to
              deliver Grocery products to consumer.
              {"\n"}
            </Text>
            <Text style={{ textAlign: "center" }}>
              City Foods {"(Future Designs Tech)"} {"\n"}Follow us on all Social
              Media platforms @cityfoods{"\n"}
            </Text>
            <Text style={{ textAlign: "center" }}>
              Inquiries / Queries{"\n"}Call{"\n"}
              {phoneLink}
            </Text>
            <View style={{ alignSelf: "center" }}>
              <Text>─────────────────────────</Text>
            </View>
            <Text style={{ textAlign: "center" }}>
              Designed by Future Designs Tech
            </Text>
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <Image
                source={require("../../assets/uganda.png")}
                style={{ width: 20, height: 20 }}
              />
              <Text style={{ textAlign: "center", fontWeight: "800" }}>
                Made in Uganda
              </Text>
              <Image
                source={require("../../assets/uganda.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

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
            <Icon name="arrow-left" size={40} />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 10 }}>
            Settings
          </Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("UserProfile")}
          >
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
                name="arrow-right-thin-circle-outline"
                size={30}
                style={{
                  position: "absolute",
                  right: 10,
                  alignSelf: "center",
                  color: "grey",
                }}
              />
            </View>
          </TouchableWithoutFeedback>
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
          <View style={{ marginBottom: 10 }}>
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
                <Icon name="cart-variant" size={30} style={{ color: "grey" }} />
                <Text
                  style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}
                >
                  My Orders
                </Text>
                <Icon
                  name="arrow-right-thin-circle-outline"
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
                <Icon
                  name="wallet-giftcard"
                  size={30}
                  style={{ color: "grey" }}
                />
                <Text
                  style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}
                >
                  My Coupons
                </Text>
                <Icon
                  name="arrow-right-thin-circle-outline"
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
                  name="wallet-outline"
                  size={30}
                  style={{ color: "grey" }}
                />
                <Text
                  style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}
                >
                  My Wallet
                </Text>
                <Icon
                  name="arrow-right-thin-circle-outline"
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
              onPress={() => navigation.navigate("UserProfile")}
            >
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
                  name="account-circle"
                  size={30}
                  style={{ color: "grey" }}
                />
                <Text
                  style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}
                >
                  Profile
                </Text>
                <Icon
                  name="arrow-right-thin-circle-outline"
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

            <View
              style={{
                borderBottomColor: "grey",
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginTop: 20,
                width: "80%",
                alignSelf: "center",
              }}
            />

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
                <Icon name="bell" size={30} style={{ color: "grey" }} />
                <Text
                  style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}
                >
                  Notifications
                </Text>
                <Icon
                  name="arrow-right-thin-circle-outline"
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

            <TouchableOpacity onPress={() => setModalVisible(true)}>
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
                  name="information-outline"
                  size={30}
                  style={{ color: "grey" }}
                />
                <Text
                  style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}
                >
                  About
                </Text>
                <Icon
                  name="arrow-right-thin-circle-outline"
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
                    ", I am requesting for assistance from City Foods App Team.&phone=" +
                    phoneLink
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
                <Icon name="whatsapp" size={60} style={{ color: "#1ba10a" }} />
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

            <View style={{ margin: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableWithoutFeedback onPress={() => OpenFacebook()}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                      name="facebook"
                      size={35}
                      style={{
                        alignSelf: "center",
                        color: "blue",
                        marginRight: 5,
                      }}
                    />
                    <Text style={{ fontSize: 18 }}>Facebook</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => OpenInstgram()}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                      name="instagram"
                      size={35}
                      style={{
                        alignSelf: "center",
                        color: "brown",
                        marginRight: 5,
                      }}
                    />
                    <Text style={{ fontSize: 18 }}>Instagram</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => OpenTwitter()}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                      name="twitter"
                      size={35}
                      style={{
                        alignSelf: "center",
                        color: "blue",
                        marginRight: 5,
                      }}
                    />
                    <Text style={{ fontSize: 18 }}>Twitter</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
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

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 10,
              }}
            >
              <TouchableWithoutFeedback onPress={() => Privacy()}>
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
                    name="arrow-right-thin-circle-outline"
                    size={30}
                    style={{
                      alignSelf: "center",
                      color: "grey",
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={() => TC()}>
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
                    name="arrow-right-thin-circle-outline"
                    size={30}
                    style={{
                      alignSelf: "center",
                      color: "grey",
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
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
          </View>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          {customDesign()}
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafa",
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

const styles2 = StyleSheet.create({
  bottomNavigationView: {
    backgroundColor: "#fff",
    minHeight: 150,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
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
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    alignSelf: "center",
    width: "80%",
    fontSize: 20,
    fontWeight: "800",
  },
});
