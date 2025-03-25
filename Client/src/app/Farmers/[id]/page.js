"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function FarmerProfile({ params }) {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const farmerId = params?.id;
        if (!farmerId) {
          throw new Error('Farmer ID is missing');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/farmer/${farmerId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch farmer data');
        }
        const data = await response.json();
        console.log('Fetched farmer profile:', data);
        setFarmer(data);
      } catch (error) {
        console.error('Error fetching farmer data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">{error || 'Farmer not found'}</p>
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
            src={farmer.banner || 'https://via.placeholder.com/1200x400'}
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
                  src={farmer.avatar || 'https://via.placeholder.com/150'}
                  alt={farmer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{farmer.name}</h1>
                {farmer.farmName && (
                  <p className="text-lg text-gray-600 mt-1">{farmer.farmName}</p>
                )}
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`h-5 w-5 text-${i < Math.floor(farmer.rating || 0) ? 'yellow' : 'gray'}-400`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    ({farmer.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Categories */}
            {farmer.categories && farmer.categories.length > 0 && (
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
            )}

            {/* Description */}
            {farmer.description && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600">{farmer.description}</p>
              </div>
            )}

            {/* Address */}
            {farmer.address && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Farm Address</h2>
                <p className="text-gray-600">{farmer.address}</p>
              </div>
            )}

            {/* Featured Products */}
            {farmer.products && farmer.products.length > 0 && (
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
                          src={product.image || 'https://via.placeholder.com/300'}
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
            )}

            {/* Reviews */}
            {farmer.reviews && farmer.reviews.length > 0 && (
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
                              <span
                                key={i}
                                className={`h-4 w-4 text-${i < review.rating ? 'yellow' : 'gray'}-400`}
                              >
                                ★
                              </span>
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
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}