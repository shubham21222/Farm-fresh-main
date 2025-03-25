'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/20/solid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock farmer data - replace with actual API call
const getFarmerData = (id) => {
  return {
    id,
    name: "John Doe",
    banner: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=1260",
    avatar: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Passionate about sustainable farming and organic produce. We specialize in growing the finest organic vegetables using traditional farming methods combined with modern sustainable practices.",
    categories: ["Organic", "Vegetables", "Sustainable", "Local"],
    rating: 4.8,
    totalReviews: 127,
    products: [
      {
        id: "p1",
        name: "Fresh Organic Tomatoes",
        image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600",
        price: 4.99
      },
      {
        id: "p2",
        name: "Organic Lettuce",
        image: "https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?auto=compress&cs=tinysrgb&w=600",
        price: 2.99
      },
      {
        id: "p3",
        name: "Farm Fresh Carrots",
        image: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=600",
        price: 3.49
      }
    ],
    reviews: [
      {
        id: "r1",
        user: "Sarah M.",
        rating: 5,
        comment: "The best organic vegetables I've ever had! The tomatoes are incredibly flavorful.",
        date: "2 days ago"
      },
      {
        id: "r2",
        user: "Mike R.",
        rating: 4,
        comment: "Great quality produce and excellent customer service. Will definitely buy again!",
        date: "1 week ago"
      },
      {
        id: "r3",
        user: "Emily L.",
        rating: 5,
        comment: "Love supporting local farmers. The organic lettuce is always fresh and crisp.",
        date: "2 weeks ago"
      }
    ]
  };
};

export default function FarmerProfile({ params }) {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const data = getFarmerData(params.id);
    setFarmer(data);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Farmer not found</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Banner Image */}
        <div className="relative h-96 w-full">
          <Image
            src={farmer.banner}
            alt={`${farmer.name}'s farm`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Farmer Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={farmer.avatar}
                  alt={farmer.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{farmer.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < farmer.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    ({farmer.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {farmer.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600">{farmer.description}</p>
            </div>

            {/* Featured Products */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {farmer.products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="relative h-48">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-green-600 font-medium mt-1">${product.price.toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {farmer.reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{review.user}</h3>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 