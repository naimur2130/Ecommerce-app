import { createContext, useEffect, useState } from "react";
import { products } from "../assets/products";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 100;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const addToCart = async (itemId, size) => {
    let copyCartItems = structuredClone(cartItems); //creating the copy of the cartItems object

    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    if (copyCartItems[itemId]) {
      if (copyCartItems[itemId][size]) {
        copyCartItems[itemId][size] += 1;
      } else {
        copyCartItems[itemId][size] = 1;
      }
    } else {
      copyCartItems[itemId] = {};
      copyCartItems[itemId][size] = 1;
    }
    setCartItems(copyCartItems);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
