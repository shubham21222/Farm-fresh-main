"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
  const products = [
    {
      name: "Fresh Vegetables",
      image: "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Locally sourced, organic vegetables"
    },
    {
      name: "Seasonal Fruits",
      image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Sweet and juicy fruits from our orchards"
    },
    {
      name: "Fresh Herbs",
      image: "https://images.pexels.com/photos/906150/pexels-photo-906150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Aromatic herbs for your kitchen"
    }
  ];

  const values = [
    {
      icon: "🌱",
      title: "Sustainability",
      description: "We prioritize environmentally friendly farming practices"
    },
    {
      icon: "🤝",
      title: "Community",
      description: "Supporting local farmers and strengthening communities"
    },
    {
      icon: "✨",
      title: "Quality",
      description: "Premium produce picked at peak freshness"
    },
    {
      icon: "💚",
      title: "Health",
      description: "Promoting healthy living through fresh, natural foods"
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[60vh] flex items-center justify-center"
        >
          <div className="absolute inset-0">
            <Image
              src="https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Farm landscape"
              fill
              className="object-cover brightness-50"
            />
          </div>
          <div className="relative text-center text-white z-10 px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Story</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Connecting local farmers with conscious consumers for a healthier tomorrow
            </p>
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 px-4"
        >
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-green-800 mb-8">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At FarmFresh, we&apos;re on a mission to revolutionize the way people access fresh, locally-grown produce. 
              We believe in creating a sustainable food system that benefits both farmers and consumers. 
              By connecting local farmers directly with consumers, we eliminate unnecessary middlemen and ensure 
              that you get the freshest produce while supporting local agriculture.
            </p>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-green-800 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Products Showcase */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20 px-4"
        >
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-green-800 text-center mb-12">Our Fresh Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg"
                >
                  <div className="relative h-80">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                      <p className="text-sm opacity-90">{product.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Impact Stats */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-green-800 text-white"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-lg opacity-90">Local Farmers</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-lg opacity-90">Happy Customers</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-lg opacity-90">Product Varieties</div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
