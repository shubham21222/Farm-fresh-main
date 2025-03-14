"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);
  }, []);

  const updateCart = (updatedItems) => {
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    setCartItems(updatedItems);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (itemName) => {
    const updatedItems = cartItems.filter((item) => item.name !== itemName);
    updateCart(updatedItems);
  };

  const updateQuantity = (itemName, change) => {
    const updatedItems = cartItems.map((item) => {
      if (item.name === itemName) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(updatedItems);
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16 pt-24">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-8 text-center text-green-800"
          >
            Your Cart
          </motion.h1>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <p className="text-xl text-gray-600">Your cart is empty</p>
              <Button asChild className="mt-4">
                <a href="/Shop">Continue Shopping</a>
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between border-b py-4 bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">
                        ${item.price} x {item.quantity} = $
                        {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.name, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.name, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-between items-center mt-8 bg-green-100 p-4 rounded-lg"
              >
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${calculateTotal()}
                </span>
              </motion.div>
              <div className="flex justify-end space-x-4 mt-4">
                <Button variant="outline" asChild>
                  <a href="/Shop">Continue Shopping</a>
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CartPage;