import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Platform } from "react-native";

import colors from "../constants/colors";

import ProductOverviewScreen from "../screens/shop/ProductOverviewScreen";

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: { screen: ProductOverviewScreen }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? colors.primary : ""
      },
      headerTintColor: Platform.OS === "android" ? "white" : colors.primary
    }
  }
);

export default createAppContainer(ProductsNavigator);
