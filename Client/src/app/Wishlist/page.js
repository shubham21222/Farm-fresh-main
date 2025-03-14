"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
    setWishlistItems(items);

    const updateWishlist = () => {
      const updatedItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
      setWishlistItems(updatedItems);
    };

    window.addEventListener("wishlistUpdated", updateWishlist);
    return () => window.removeEventListener("wishlistUpdated", updateWishlist);
  }, []);

  const removeFromWishlist = (itemName) => {
    const updatedItems = wishlistItems.filter((item) => item.name !== itemName);
    localStorage.setItem("wishlistItems", JSON.stringify(updatedItems));
    setWishlistItems(updatedItems);
    window.dispatchEvent(new Event("wishlistUpdated"));
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
            Your Wishlist
          </motion.h1>

          {wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <p className="text-xl text-gray-600">Your wishlist is empty</p>
              <Button asChild className="mt-4">
                <a href="/Shop">Continue Shopping</a>
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {wishlistItems.map((item, index) => (
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
                      <p className="text-gray-600">${item.price}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromWishlist(item.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
              <div className="flex justify-end mt-4">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href="/Shop">Back to Shop</a>
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

export default WishlistPage;