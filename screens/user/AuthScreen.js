import React, { useState, useReducer, useEffect, useCallback } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import * as authActions from "../../store/actions/auth";
import colors from "../../constants/colors";
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    // estados iniciales
    inputValues: {
      email: "",
      password: ""
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const authHandler = async () => {
    console.log("[AuthScreen]...authHandler firing");
    let action;
    if (isSignUp) {
      action = authActions.signUp(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Shop");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangedHandler = useCallback(
    (inputIdentifier, inputValue, inputValididty) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValididty,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVertical
      Offset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffffff", "#abbaab"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Por favor ingrese tu correo electronico"
              onInputChange={inputChangedHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Por favor ingrese tu contraseña"
              onInputChange={inputChangedHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Button
                  title={isSignUp ? "Regístrate" : "Iniciar sesión"}
                  color={colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={
                  isSignUp
                    ? "Cambiar a iniciar sesión"
                    : "Cambiar a registración"
                }
                color={colors.accent}
                onPress={() => {
                  setIsSignUp(prevState => !prevState);
                }}
              />
            </View>
            {props.goNow ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{props.errorText}</Text>
              </View>
            ) : null}
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: "Autenticar"
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  authContainer: { width: "80%", maxWidth: 400, maxHeight: 400, padding: 20 },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
    marginTop: 10
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    fontFamily: "open-sans",
    color: "red",
    fontSize: 13
  }
});

export default AuthScreen;
