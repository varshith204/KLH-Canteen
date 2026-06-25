import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const email = user?.email;
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!email) {
      setCart([]);
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem(`cart-${email}`)) || [];
    setCart(savedCart);
  }, [email]);

  useEffect(() => {
    if (email) localStorage.setItem(`cart-${email}`, JSON.stringify(cart));
  }, [cart, email]);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((cartItem) => cartItem.id === item.id);
      if (found) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, addToCart, decreaseQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
