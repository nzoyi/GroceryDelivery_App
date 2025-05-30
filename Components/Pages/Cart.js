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
import { PayWithFlutterwave } from "flutterwave-react-native";
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

export default function Cart({ navigation, route }) {
  const couponCode = route.params;

  //console.log(couponCode);

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

  let user = auth.currentUser;

  if (!user) {
    navigation.replace("Login");
  }

  const [itemArray, setItemArray] = useState([]);

  const itemsRef2 = ref(db, "Cart/" + user.uid);

  function ItemImages() {
    let isMounted = true;
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
      }
    });
    return () => {
      isMounted = false;
    };
  }

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");

  const itemsRef4 = ref(db, "UserAccounts/" + user.uid);

  function userInfo() {
    let isMounted = true;
    get(itemsRef4).then((snapshot) => {
      if (isMounted) {
        let dataVal = snapshot.val();
        setUsername(dataVal.Name);
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

  const [balance, setBalance] = useState("");

  const itemsRef6 = ref(db, "Admin/Account/");
  function adminAcc() {
    let isMounted = true;
    get(itemsRef6).then((snapshot) => {
      if (isMounted) {
        let dataVal = snapshot.val();
        setBalance(dataVal.Balance);
        //console.log(dataVal.Balance);
      }
    });
    return () => {
      isMounted = false;
    };
  }

  useEffect(() => {
    ItemImages();
    adminAcc();
    userInfo();
  }, []);

  const [validPromo, setValidPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoPerc, setPromoPerc] = useState(0);
  const [promoUsers, setPromoUsers] = useState(0);
  const [promoId, setPromoId] = useState("");

  const [aboutVisible, setAboutVisible] = useState(false);

  if (couponCode) {
    const itemsRef4 = query(
      ref(db, "UserAccounts/" + user.uid + "/Coupons/"),
      orderByChild("PromoCode"),
      equalTo(couponCode)
    );

    useEffect(() => {
      let isMounted = true;
      get(itemsRef4).then((snapshot) => {
        if (isMounted) {
          snapshot.forEach((child) => {
            let dataVal = child.val();
            setPromoPerc(dataVal.Offer);
            setValidPromo(true);
            setPromoId(dataVal.id);
            //console.log(dataVal.Coupon);
          });
        }
      });
      return () => {
        isMounted = false;
      };
    }, []);
  }

  const toggleBottom = () => {
    setAboutVisible(!aboutVisible);
  };

  const ShowCart = () => {
    return (
      <View>
        {itemArray.map((items, index) => (
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              margin: 5,
              backgroundColor: "white",
              borderRadius: 20,
            }}
            key={index}
          >
            <Image
              source={{ uri: items.key.Image }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 10,
              }}
            />
            <View style={{ marginLeft: 30 }}>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>
                {items.key.Name}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "400" }}>
                {items.key.Category}
              </Text>

              <ShowCalc item={items.key} itemid={items.id} />
            </View>
            <View style={{ position: "absolute", right: 10, top: 10 }}>
              <TouchableOpacity onPress={() => deleteItem(items.id)}>
                <Icon name="delete-outline" size={30} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  function deleteItem(id) {
    const itemsRef2 = ref(db, "Cart/" + user.uid);
    itemsRef2
      .child(id)
      .remove()
      .then(showToast("Product Deleted Successfully"))
      .catch((error) => showToast("Error" + error));
  }

  function getTotal() {
    let PriceNumber;

    if (promoPerc > 0) {
      PriceNumber = itemArray.reduce(
        (sum, product) => sum + product.key.Price,
        0
      );
      let math = promoPerc / 100;
      let math2 = PriceNumber + 5000;
      let math3 = math2 * math;
      // console.log(math3);
      return math2 - math3;
    } else {
      PriceNumber = itemArray.reduce(
        (sum, product) => sum + product.key.Price,
        0
      );
      return PriceNumber + 5000;
    }
  }

  //Custome Design

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

            <Text style={styles2.modalText}>Payment Details</Text>
            <View></View>
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View
            style={{
              margin: 10,
              padding: 10,
              borderRadius: 5,
              elevation: 2,
              backgroundColor: "white",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18 }}>Name</Text>
              <Text style={{ fontSize: 18 }}>{username}</Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18 }}>Phone Number</Text>
              <Text style={{ fontSize: 18 }}>{phone}</Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18 }}>Country</Text>
              <Text style={{ fontSize: 18 }}>{address1}</Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18 }}>City</Text>
              <Text style={{ fontSize: 18 }}>{address2}</Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18 }}>Local Address</Text>
              <Text style={{ fontSize: 18 }}>{address3}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setAboutVisible(false);
                navigation.navigate("UserProfile");
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "blue",
                  margin: 10,
                  alignSelf: "flex-end",
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              padding: 10,
              borderRadius: 5,
              elevation: 2,
              backgroundColor: "white",
            }}
          >
            <Text style={styles2.modalText}>Choose Payment Method</Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => OrderNow()}
                disabled={pressed}
                style={{
                  backgroundColor: "blue",
                  borderRadius: 5,
                  color: "white",
                  padding: 10,
                }}
              >
                {pressed ? (
                  <Text
                    style={{
                      fontSize: 18,
                      color: "white",
                      fontWeight: "800",
                    }}
                  >
                    Please Wait....
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 18,
                      color: "white",
                      fontWeight: "800",
                    }}
                  >
                    CASH ON DELIVERY
                  </Text>
                )}
              </TouchableOpacity>

              <PayWithFlutterwave
                onRedirect={handleOnRedirect}
                options={{
                  tx_ref: generateTransactionRef(10),
                  authorization:
                    "FLWPUBK_TEST-6c690d975ff8679b836e037833bb3487-X",
                  customer: {
                    email: "" + user?.email,
                    name: username,
                    phonenumber: phone,
                  },
                  amount: getTotal(),
                  currency: "K",
                  payment_options: "mobilemoney,card",
                }}
                customButton={(props) => (
                  <TouchableOpacity
                    onPress={props.onPress}
                    isBusy={props.isInitializing}
                    disabled={pressed2}
                    style={{
                      backgroundColor: "orange",
                      borderRadius: 5,
                      color: "white",
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: "white",
                        fontWeight: "800",
                      }}
                    >
                      MOBILE MONEY
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  //Finish Payment

  const generateTransactionRef = (length: number) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
  };

  interface RedirectParams {
    status: "successful" | "cancelled";
    transaction_id?: string;
    tx_ref: string;
  }

  const handleOnRedirect = (data: RedirectParams) => {
    const getStatus = data.status;
    console.log(getStatus);
    if (getStatus == "successful") {
      showToast("Payment Succesfull Check Email..");
      // console.log(data);
      OrderNow2();
    } else {
      showToast("Error while Making Payment. Try Again");
    }
  };

  const recKey = push(ref(db, "UserAccounts/" + user.uid + "/Orders/")).key;

  const date = new Date().toLocaleString();

  const [pressed, setPressed] = useState(false);
  const [pressed2, setPressed2] = useState(false);

  function OrderNow() {
    setPressed(true);
    const itemsRef6 = ref(db, "Cart/" + user.uid);
    itemArray.map((items) => {
      const itemsRef = push(
        ref(db, "UserAccounts/" + user.uid + "/Orders/" + recKey)
      );

      set(itemsRef, { Items: items.key })
        .then(() => {
          if (promoPerc > 0) {
            if (couponCode) {
              const itemsRef3 = ref(
                db,
                "UserAccounts/" + user.uid + "/Coupons/" + promoId + "/"
              );
              set(itemsRef3, { Used: "Yes" });
            } else {
              const itemsRef3 = ref(
                db,
                "PromoCodes/" + promoId + "/" + user.uid + "/" + user.uid
              );

              set(itemsRef3, true);

              let users = promoUsers - 1;

              const itemsRef = ref(db, "PromoCodes/" + promoId);

              set(itemsRef, { NumberOfUsers: users });
            }
          }

          const itemsRef3 = ref(
            db,
            "UserAccounts/" + user.uid + "/Orders/" + recKey
          );
          set(itemsRef3, { Date: "" + date });
          set(itemsRef3, { Amount: getTotal() });
          set(itemsRef3, { PaymentMethod: "Cash On Delivery" });
          set(itemsRef3, { Status: "Pending" });
          if (promoPerc > 0) {
            set(itemsRef3, { Offer: promoPerc });
          }

          set(itemsRef3, { TransportFee: 5000 })
            .then(console.log("firstUpload"))
            .catch((error) => showToast("error" + error));
        })
        .catch((error) => showToast("Error" + error));

      const adminRef = push(ref(db, "Admin/Orders/" + recKey + "/Items"));

      adminRef;
      set(items.key)
        .then(() => {
          const itemsRef3 = ref(db, "Admin/Orders/" + recKey);

          set(itemsRef3, { Date: "" + date });
          set(itemsRef3, { UserId: user.uid });

          set(itemsRef3, { Amount: getTotal() });

          set(itemsRef3, { PaymentMethod: "Cash On Delivery" });

          set(itemsRef3, { Status: "Pending" });

          if (promoPerc > 0) {
            set(itemsRef3, { Offer: promoPerc });
          }

          set(itemsRef3, { Name: username });

          set(itemsRef3, { Phone: phone });

          set(itemsRef3, { Location: address2 + " - " + address3 });

          set(itemsRef3, { TransportFee: 5000 })
            .then(() => {
              setPressed(false);
              remove(itemsRef6)
                .then(() => {
                  setPressed(false);
                  navigation.navigate("Orders");
                })
                .catch((error) => showToast("Error" + error));
            })
            .catch((error) => showToast("error" + error));
        })
        .catch((error) => showToast("Error" + error));
    });
  }

  function OrderNow2() {
    setPressed2(true);

    const itemsRef6 = ref(db, "Cart/" + user.uid);
    itemArray.map((items) => {
      const itemsRef = push(
        ref(db, "UserAccounts/" + user.uid + "/Orders/" + recKey)
      );

      set(itemsRef, { Items: items.key })
        .then(() => {
          if (promoPerc > 0) {
            if (couponCode) {
              const itemsRef3 = ref(
                db,
                "UserAccounts/" + user.uid + "/Coupons/" + promoId + "/"
              );

              set(itemsRef3, { Used: "Yes" });
            } else {
              const itemsRef3 = ref(
                db,
                "PromoCodes/" + promoId + "/" + user.uid + "/" + user.uid
              );

              set(itemsRef3, true);

              let users = promoUsers - 1;

              const itemsRef = ref(db, "PromoCodes/" + promoId);

              set(itemsRef, { NumberOfUsers: users });
            }
          }

          let orig = getTotal();
          let final = orig + balance;

          const itemsRef = ref(db, "Admin/Account/");

          set(itemsRef, { Balance: final });

          const itemsRef3 = ref(
            db,
            "UserAccounts/" + user.uid + "/Orders/" + recKey
          );

          set(itemsRef3, { Date: "" + date });
          set(itemsRef3, { Amount: getTotal() });
          set(itemsRef3, { PaymentMethod: "MobileMoney" });
          set(itemsRef3, { Status: "Pending" });
          if (promoPerc > 0) {
            set(itemsRef3, { Offer: promoPerc });
          }

          set(itemsRef3, { TransportFee: 5000 })
            .then(console.log("FirstUpload"))
            .catch((error) => showToast("error" + error));
        })
        .catch((error) => showToast("Error" + error));

      const adminRef = push(ref(db, "Admin/Orders/" + recKey));

      set(adminRef, { Items: items.key })
        .then(() => {
          const itemsRef3 = ref(db, "Admin/Orders/" + recKey);
          set(itemsRef3, { Date: "" + date });
          set(itemsRef3, { UserId: user.uid });

          set(itemsRef3, { Amount: getTotal() });

          set(itemsRef3, { PaymentMethod: "MobileMoney" });

          set(itemsRef3, { Status: "Pending" });

          if (promoPerc > 0) {
            set(itemsRef3, { Offer: promoPerc });
          }

          set(itemsRef3, { Name: username });

          set(itemsRef3, { Phone: phone });

          set(itemsRef3, { Location: address2 + " - " + address3 });

          set(itemsRef3, { TransportFee: 5000 })
            .then(() => {
              setPressed(false);
              remove(itemsRef6)
                .then(() => {
                  setPressed2(false);
                  navigation.navigate("Orders");
                })
                .catch((error) => showToast("Error" + error));
            })
            .catch((error) => showToast("error" + error));
        })
        .catch((error) => showToast("Error" + error));
    });
  }

  //SHow Caution
  function showCaution() {
    Alert.alert(
      "Delete Cart",
      "Are you sure you want to delete all items from cart?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteItem2() },
      ]
    );
  }

  function deleteItem2() {
    const itemsRef2 = ref(db, "Cart/" + user.uid);
    itemsRef2
      .remove()
      .then(showToast("Deleted Successfully"))
      .catch((error) => showToast("Error" + error));
  }

  //Promo Code

  function ValidateCode() {
    let valid = true;
    const codeList = query(
      ref(db, "PromoCodes/"),
      orderByChild("Code"),
      equalTo(promoCode)
    );

    get(codeList).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          let dataVal1 = child.key;
          let dataVal = child.val();
          if (child.child(user.uid).exists()) {
            valid = false;
          } else {
            valid = true;
            setValidPromo(true);
            setPromoUsers(dataVal.NumberOfUsers);
            setPromoPerc(dataVal.Percentage);

            setPromoId(dataVal1);
          }
        });
      } else {
        showToast("Invalid Promo Code");
      }
    });

    if (valid) {
    } else {
      //showToast("Code Already Used");
    }
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
            padding: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="keyboard-arrow-left" size={40} />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 10 }}>
            Shopping Cart
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
                No Items Available
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("MainPage")}>
                <Text
                  style={{ textAlign: "center", fontSize: 20, color: "blue" }}
                >
                  Order Now
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <ShowCart />
            </ScrollView>
          )}
          {itemArray.length == 0 ? null : (
            <View
              style={{
                minHeight: 100,
                backgroundColor: "white",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: "#e6edf0",
                  elevation: 5,
                  borderRadius: 5,
                  padding: 10,
                  marginLeft: 20,
                  marginRight: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: -20,
                }}
              >
                <Icon
                  name="loyalty"
                  size={30}
                  style={{
                    color: "blue",
                    transform: [{ scaleX: -1 }],
                    alignSelf: "flex-start",
                  }}
                />
                <TextInput
                  placeholder={couponCode ? couponCode : "Add Promo Code"}
                  placeholderTextColor={"black"}
                  onChangeText={(text) => setPromoCode(text)}
                  style={styles.searchInputContainer}
                />
                {couponCode ? (
                  <Icon
                    name="check-circle"
                    size={20}
                    style={{
                      color: "green",
                      alignSelf: "flex-end",
                      padding: 5,

                      right: 10,
                    }}
                  />
                ) : validPromo ? (
                  <Icon
                    name="check-circle"
                    size={20}
                    style={{
                      color: "green",
                      alignSelf: "flex-end",
                      padding: 5,

                      right: 10,
                    }}
                  />
                ) : (
                  <TouchableOpacity onPress={() => ValidateCode()}>
                    <Icon
                      name="arrow-forward-ios"
                      size={20}
                      style={{
                        color: "blue",
                        alignSelf: "flex-end",
                        padding: 5,
                        backgroundColor: "white",
                        right: 10,
                        borderRadius: 20,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "700" }}>
                  Transport Fee
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "700" }}>K 5000</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "700" }}>
                  Percentage
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "700" }}>
                  {promoPerc ? promoPerc : 0}% OFF
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 20,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "700" }}>
                  Total Price
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "700" }}>
                  K {getTotal()}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 10,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => showCaution()}>
                  <Text
                    style={{ color: "blue", fontSize: 20, fontWeight: "700" }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setAboutVisible(true)}
                  style={{
                    padding: 10,
                    backgroundColor: "blue",
                    borderRadius: 20,
                    width: 250,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    Place Order
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    backgroundColor: "#f7fafa",
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
