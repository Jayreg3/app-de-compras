import { AsyncStorage } from "react-native";

// export const SIGN_UP = "SIGN_UP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signUp = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyATcSW9OphNP3jY-ZXrH8TfKUIedNimoyQ",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = "Se ha producido un error. Reintentarlo por favor.";
        if (errorId === "EMAIL_EXISTS") {
          message = "Ya existe una cuenta con este correo electronico";
        } else if (errorId === "TOO_MANY_ATTEMPTS_TRY_LATER") {
          message = "Por favor espera un momento y reintentarlo luego";
        }
        console.log("errorId = ", errorId);
        throw new Error(message);
      }
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyATcSW9OphNP3jY-ZXrH8TfKUIedNimoyQ",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Se ha producido un error. Reintentarlo por favor.";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "No se ha encontrado este correo electronico";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "No se ha encontrado esta contraseña";
      } else if (
        errorId ===
        "TOO_MANY_ATTEMPTS_TRY_LATER : Too many unsuccessful login attempts. Please try again later."
      ) {
        message = "Por favor espera un momento y reintentarlo luego";
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString()
    })
  );
};
