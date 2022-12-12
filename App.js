import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import SplashScreen from "./Components/Pages/SplashScreen";
import MainPage from "./Components/Pages/MainPage";
import Login from "./Components/Pages/Login";

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <Screen name="SplashScreen" component={SplashScreen}></Screen>
        <Screen name="Login" component={Login}></Screen>
        <Screen name="MainPage" component={MainPage}></Screen>
      </Navigator>
    </NavigationContainer>
  );
}
