import React from "react";
import { FlatList, Platform, Button, Alert, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import ProductItem from "../../components/shop/ProductItem";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import colors from "../../constants/colors";
import * as productsActions from "../../store/actions/products";

const UserProductsScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const editProductHandler = id => {
    props.navigation.navigate("EditProduct", { productId: id });
  };

  const deleteHandler = id => {
    Alert.alert("¿Estás seguro?", "¿Quieres retirar este articulo?", [
      { text: "No", style: "default" },
      {
        text: "Retirar",
        style: "destructive",
        onPress: () => dispatch(productsActions.deleteProduct(id))
      }
    ]);
  };

  if (userProducts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No se ha encontrado ningun producto. Agregue uno!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => editProductHandler(itemData.item.id)}
        >
          <Button
            color={colors.primary}
            title="Editar"
            onPress={() => editProductHandler(itemData.item.id)}
          />
          <Button
            color={colors.primary}
            title="Descatar"
            onPress={() => deleteHandler(itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

UserProductsScreen.navigationOptions = navData => {
  return {
    headerTitle: "Tus productos",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    )
  };
};

export default UserProductsScreen;
