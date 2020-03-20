import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ShopNavigator from "./ShopNavigator";
import { NavigationActions } from "react-navigation";

const NavigationContainer = props => {
  const navRef = useRef();
  console.log(
    "[NavigationContainer]...token antes = ",
    useSelector(state => state.auth.token)
  );
  const isAuth = useSelector(state => !!state.auth.token);
  console.log("[NavigationContainer]...isAuth = ", isAuth);

  useEffect(() => {
    console.log("[NavigationContainer]...useEffect");
    if (!isAuth) {
      console.log("[NavigationContainer]...useEffect...!isAuth");
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);
  return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;
