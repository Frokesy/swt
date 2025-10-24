import { useEffect, useState } from "react";
import { get, set } from "idb-keyval";
import type { ReactNode } from "react";
import type { ProductType } from "../components/data/products";
import { CartContext } from "./CartContext";

export interface CartContextType {
  cartItems: ProductType[];
  cartCount: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
  addToCart: (product: ProductType) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  increment: (id: number) => Promise<void>;
  decrement: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<ProductType[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const loadCart = async () => {
    const items: ProductType[] = (await get("cartItems")) || [];
    setCartItems(items);
    setCartCount(items.length);
  };

  const syncCart = async (items: ProductType[]) => {
    setCartItems(items);
    setCartCount(items.length);
    await set("cartItems", items);
  };

  const addToCart = async (product: ProductType) => {
    const existingCart: ProductType[] = (await get("cartItems")) || [];
    const existingItem = existingCart.find((item) => item.id === product.id);

    const updatedCart = existingItem
      ? existingCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity ?? 1) + 1 }
            : item
        )
      : [...existingCart, { ...product, quantity: 1 }];

    await syncCart(updatedCart);
  };

  const removeFromCart = async (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    await syncCart(updated);
  };

  const increment = async (id: number) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
    );
    await syncCart(updated);
  };

  const decrement = async (id: number) => {
    const updated = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity ?? 1) - 1) }
          : item
      )
      .filter((item) => (item.quantity ?? 1) > 0);
    await syncCart(updated);
  };

  const clearCart = async () => {
    setCartItems([]);
    setCartCount(0);
    await set("cartItems", []);
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity ?? 1),
    0
  );

  useEffect(() => {
    loadCart();
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPrice,
        refreshCart: loadCart,
        addToCart,
        removeFromCart,
        increment,
        decrement,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
