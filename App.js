/** @format */

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import SplashScreen from "./Components/Pages/SplashScreen";
import MainPage from "./Components/Pages/MainPage";
import Login from "./Components/Pages/Login";
import ProductDetails from "./Components/Pages/ProductDetails";
import HomePage from "./Components/Pages/HomePage";
import Cart from "./Components/Pages/Cart";
import AllProducts from "./Components/Pages/AllProducts";
import Profile from "./Components/Pages/Profile";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnBoardingScreen from "./Components/Pages/OnboardingScreen";
import SearchPage from "./Components/Pages/SearchPage";
import Favorite from "./Components/Pages/Favorite";
import Orders from "./Components/Pages/Orders";
import UserProfile from "./Components/Pages/UserProfile";
import Coupons from "./Components/Pages/Coupons";
import Settings from "./Components/Pages/Settings";
import TourPage from "./Components/Pages/TourPage";
import * as Updates from "expo-updates";

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    reactToUpdates();
  });

  const reactToUpdates = async () => {
    Updates.addListener((event) => {
      if (event.type == Updates.UpdateEventType.UPDATE_AVAILABLE) {
        alert("An Update is available, Resart your app to see it");
      }
    });
  };

  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value == null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch == null) {
    return null;
  } else if (isFirstLaunch == true) {
    return (
      <NavigationContainer>
        <Navigator
          initialRouteName="OnBoardingScreen"
          screenOptions={{ headerShown: false }}
        >
          <Screen name="OnBoardingScreen" component={OnBoardingScreen}></Screen>
          <Screen name="TourPage" component={TourPage}></Screen>
          <Screen name="Login" component={Login}></Screen>
          <Screen name="HomePage" component={HomePage}></Screen>
          <Screen name="MainPage" component={MainPage}></Screen>
          <Screen name="ProductDetails" component={ProductDetails}></Screen>
          <Screen name="Cart" component={Cart}></Screen>
          <Screen name="AllProducts" component={AllProducts}></Screen>
          <Screen name="Profile" component={Profile}></Screen>
          <Screen name="SearchPage" component={SearchPage}></Screen>
          <Screen name="Favorite" component={Favorite}></Screen>
          <Screen name="Orders" component={Orders}></Screen>
          <Screen name="Coupons" component={Coupons}></Screen>
          <Screen name="Settings" component={Settings}></Screen>
          <Screen name="UserProfile" component={UserProfile}></Screen>
        </Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Navigator
          initialRouteName="SplashScreen"
          screenOptions={{ headerShown: false }}
        >
          <Screen name="SplashScreen" component={SplashScreen}></Screen>
          <Screen name="TourPage" component={TourPage}></Screen>
          <Screen name="Login" component={Login}></Screen>
          <Screen name="HomePage" component={HomePage}></Screen>
          <Screen name="MainPage" component={MainPage}></Screen>
          <Screen name="ProductDetails" component={ProductDetails}></Screen>
          <Screen name="Cart" component={Cart}></Screen>
          <Screen name="AllProducts" component={AllProducts}></Screen>
          <Screen name="Profile" component={Profile}></Screen>
          <Screen name="SearchPage" component={SearchPage}></Screen>
          <Screen name="Favorite" component={Favorite}></Screen>
          <Screen name="Orders" component={Orders}></Screen>
          <Screen name="Coupons" component={Coupons}></Screen>
          <Screen name="Settings" component={Settings}></Screen>
          <Screen name="UserProfile" component={UserProfile}></Screen>
        </Navigator>
      </NavigationContainer>
    );
  }
}
