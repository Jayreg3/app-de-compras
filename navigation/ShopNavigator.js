import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Platform } from "react-native";

import colors from "../constants/colors";

import ProductOverviewScreen from "../screens/shop/ProductOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: { screen: ProductOverviewScreen },
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? colors.primary : ""
      },
      headerTitleStyle: {
        fontFamily: "open-sans-bold"
      },
      headerBackTitleStyle: {
        fontFamily: "open-sans"
      },
      headerTintColor: Platform.OS === "android" ? "white" : colors.primary
    }
  }
);

export default createAppContainer(ProductsNavigator);
