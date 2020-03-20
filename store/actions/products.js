export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";
import Product from "../../models/product";

export const fetchProducts = () => {
  console.log("[actions/products]...firing");
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        "https://app-de-compras-a3fa8.firebaseio.com/products.json"
      );

      if (!response.ok) {
        throw new Error("Se ha producido un error.");
      }
      const resData = await response.json();
      const loadedProducts = [];
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }
      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
      });
      console.log("[actions/products]...loadedProducts = ", loadedProducts);
    } catch (err) {
      console.log("[actions/products]...catching error...err = ", err);
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://app-de-compras-a3fa8.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Se ha producido un error. Reintentarlo por favor.");
    }

    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://app-de-compras-a3fa8.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title: title,
        description,
        imageUrl,
        price,
        ownerId: userId
      }
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://app-de-compras-a3fa8.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ title, description, imageUrl })
      }
    );

    if (!response.ok) {
      throw new Error("Se ha producido un error. Reintentarlo por favor.");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title: title,
        description,
        imageUrl
      }
    });
  };
};
