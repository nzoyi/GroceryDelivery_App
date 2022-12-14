import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import Onboarding from "react-native-onboarding-swiper";

const OnBoardingScreen = ({ navigation }) => {
  const Skip = () => <Button title="Skip" />;

  const Done = ({ ...Props }) => (
    <TouchableOpacity style={{ marginHorizontal: 10 }} {...Props}>
      <Text style={{ fontSize: 16, color: "white" }}>Done</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#000000"
        translucent={false}
      />
      <Onboarding
        onSkip={() => navigation.replace("Login")}
        onDone={() => navigation.navigate("Login")}
        DoneButtonComponent={Done}
        pages={[
          {
            backgroundColor: "#eb9b13",
            image: (
              <Image
                source={require("../../assets/fruits.png")}
                resizeMode="center"
                style={{ width: 200, height: 200 }}
              />
            ),
            title: "HIGH QUALITY",
            subtitle:
              "Choose the Best on demand products. High Quality is what you need and it all we got to offer. Clean and Fresh Farm Produce at your disposal",
          },
          {
            backgroundColor: "#e30e63",
            image: (
              <Image
                source={require("../../assets/low-price.png")}
                resizeMode="center"
                style={{ width: 200, height: 200 }}
              />
            ),
            title: "LOW PRICES",
            subtitle:
              "No Hustle. No Hard Work. Just Low Prices. Get all your Fruits/Vegetable/Food staff at the lowest prices possible.",
          },
          {
            backgroundColor: "#0e8ae3",
            image: (
              <Image
                source={require("../../assets/delivery.png")}
                resizeMode="center"
                style={{ width: 200, height: 200 }}
              />
            ),
            title: "FAST DELIVERY",
            subtitle:
              "We know time is precious! So get all your orders in the shortest time possible in the most safe way. All our deliveries are well packed to suite the Journey.",
          },
        ]}
      />
    </SafeAreaView>
  );
};
export default OnBoardingScreen;
