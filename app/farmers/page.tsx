'use client';

import { motion } from 'framer-motion';
import FarmerCard from './FarmerCard';

// Sample Farmers Data
const farmers = [
  {
    id: "1",
    name: "John Doe",
    location: "Sunnyvale Farms, CA",
    image: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=600",
    specialty: "Organic Vegetables",
    experience: "15+ years",
    description: "Passionate about sustainable farming and organic produce."
  },
  {
    id: "2",
    name: "Maria Silva",
    location: "Green Hills, OR",
    image: "https://images.pexels.com/photos/5946108/pexels-photo-5946108.jpeg?auto=compress&cs=tinysrgb&w=600",
    specialty: "Fruit Orchards",
    experience: "20+ years",
    description: "Third-generation farmer specializing in heritage fruit varieties."
  },
  {
    id: "3",
    name: "Robert Chen",
    location: "Valley View Farm, WA",
    image: "https://images.pexels.com/photos/8911786/pexels-photo-8911786.jpeg?auto=compress&cs=tinysrgb&w=600",
    specialty: "Hydroponic Farming",
    experience: "10+ years",
    description: "Pioneer in modern sustainable farming techniques."
  }
];

export default function Farmers() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-800"
      >
        Our Featured Farmers
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {farmers.map((farmer, index) => (
          <FarmerCard key={farmer.id} farmer={farmer} index={index} />
        ))}
      </div>
    </div>
  );
} 