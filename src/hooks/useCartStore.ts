import { useEffect, useState } from "react";
import { get } from "idb-keyval";
import type { ProductType } from "../components/data/products";

export const useCartStore = () => {
  const [cartCount, setCartCount] = useState(0);

  const loadCart = async () => {
    const items: ProductType[] = (await get("cartItems")) || [];
    setCartCount(items.length);
  };

  useEffect(() => {
    loadCart();

    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  return {
    cartCount,
    refreshCart: loadCart,
  };
};
