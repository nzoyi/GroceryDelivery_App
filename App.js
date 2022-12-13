import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import SplashScreen from "./Components/Pages/SplashScreen";
import MainPage from "./Components/Pages/MainPage";
import Login from "./Components/Pages/Login";
import ProductDetails from "./Components/Pages/ProductDetails";
import HomePage from "./Components/Pages/HomePage";
import Cart from "./Components/Pages/Cart";
import AllProducts from "./Components/Pages/AllProducts";
import Profile from "./Components/Pages/Profile";

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
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
          <Screen name="Login" component={Login}></Screen>
          <Screen name="HomePage" component={HomePage}></Screen>
          <Screen name="MainPage" component={MainPage}></Screen>
          <Screen name="ProductDetails" component={ProductDetails}></Screen>
          <Screen name="Cart" component={Cart}></Screen>
          <Screen name="AllProducts" component={AllProducts}></Screen>
          <Screen name="Profile" component={Profile}></Screen>
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
          <Screen name="Login" component={Login}></Screen>
          <Screen name="HomePage" component={HomePage}></Screen>
          <Screen name="MainPage" component={MainPage}></Screen>
          <Screen name="ProductDetails" component={ProductDetails}></Screen>
          <Screen name="Cart" component={Cart}></Screen>
          <Screen name="AllProducts" component={AllProducts}></Screen>
          <Screen name="Profile" component={Profile}></Screen>
        </Navigator>
      </NavigationContainer>
    );
  }
}
