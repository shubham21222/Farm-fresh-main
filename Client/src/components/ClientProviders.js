"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </Provider>
  );
}