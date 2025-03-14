"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const products = [
  {
    name: "Fresh Bananas",
    price: "4.99",
    image: "https://cdn.pixabay.com/photo/2016/03/05/22/43/bananas-1239436_1280.jpg",
    badge: "Sale",
    category: "fruits",
  },
  {
    name: "Organic Tomatoes",
    price: "3.99",
    image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg",
    category: "vegetables",
  },
  {
    name: "Sweet Oranges",
    price: "5.99",
    image: "https://images.unsplash.com/photo-1611080626919-63d5673a27e3",
    badge: "New",
    category: "fruits",
  },
  {
    name: "Red Apples",
    price: "2.99",
    image: "https://cdn.pixabay.com/photo/2016/08/12/22/34/apple-1589874_1280.jpg",
    category: "fruits",
  },
  {
    name: "Fresh Broccoli",
    price: "3.49",
    image: "https://images.pexels.com/photos/1359326/pexels-photo-1359326.jpeg",
    category: "vegetables",
  },
  {
    name: "Organic Carrots",
    price: "2.49",
    image: "https://cdn.pixabay.com/photo/2015/11/07/11/34/carrots-1031568_1280.jpg",
    category: "vegetables",
  },
  {
    name: "Green Lettuce",
    price: "1.99",
    image: "https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg",
    category: "vegetables",
  },
  {
    name: "Fresh Strawberries",
    price: "6.99",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b0387b",
    badge: "Popular",
    category: "fruits",
  },
];

const ProductsSection = ({ products: propProducts, categoryFilter }) => {
  const displayProducts = propProducts || products;
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
    setWishlistItems(items);
  }, []);

  const addToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItem = cartItems.find((item) => item.name === product.name);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const addToWishlist = (product) => {
    const currentWishlist = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
    const existingItem = currentWishlist.find((item) => item.name === product.name);
    
    if (!existingItem) {
      currentWishlist.push({ ...product });
      localStorage.setItem("wishlistItems", JSON.stringify(currentWishlist));
      setWishlistItems(currentWishlist);
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  };

  const isInWishlist = (productName) => {
    return wishlistItems.some((item) => item.name === productName);
  };

  // Apply filters
  let filteredProducts = [...displayProducts];

  // Category filter
  if (categoryFilter?.category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === categoryFilter.category
    );
  }

  // Badge filter
  if (categoryFilter?.badge) {
    filteredProducts = filteredProducts.filter(
      (product) => product.badge === categoryFilter.badge
    );
  }

  // Sorting
  if (categoryFilter?.sort) {
    switch (categoryFilter.sort) {
      case "price-low-high":
        filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high-low":
        filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name-a-z":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-z-a":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {filteredProducts.map((product, index) => (
        <motion.div 
          key={index} 
          whileHover={{ scale: 1.05, y: -10 }} 
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="group overflow-hidden">
            <CardContent className="p-4">
              <div className="relative mb-4 overflow-hidden rounded-lg">
                {product.badge && (
                  <Badge className="absolute top-2 right-2 z-10">
                    {product.badge}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => addToWishlist(product)}
                >
                  <Heart 
                    className={`h-5 w-5 ${isInWishlist(product.name) ? 'fill-red-500 text-red-500' : 'text-red-500'}`} 
                  />
                </Button>
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </motion.div>
              </div>
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">${product.price}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductsSection;