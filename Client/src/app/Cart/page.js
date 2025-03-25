"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchCart, removeFromCart, updateQuantity, clearCart } from "@/store/slices/cartSlice";
import { createOrder } from "@/store/slices/orderSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, total, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await dispatch(createOrder({ items, total })).unwrap();
      dispatch(clearCart());
      router.push('/profile');
    } catch (error) {
      console.error('Failed to create order:', error);
    }
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

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : items.length === 0 ? (
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
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between border-b py-4 bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-center">
                    <Image
                      src={item.product?.image || item.image} // Adjust based on backend response
                      alt={item.product?.name || item.name}
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{item.product?.name || item.name}</h3>
                      <p className="text-gray-600">
                        ${item.price} x {item.quantity} = $
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item._id)}
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
                  ${total.toFixed(2)}
                </span>
              </motion.div>
              <div className="flex justify-end space-x-4 mt-4">
                <Button variant="outline" asChild>
                  <a href="/Shop">Continue Shopping</a>
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
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