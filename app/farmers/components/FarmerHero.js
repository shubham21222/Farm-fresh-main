'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import FarmerRegistrationModal from './FarmerRegistrationModal';

export default function FarmerHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 mb-4 tracking-tight">
        Meet Our Farmers
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
        Discover the dedicated individuals who wake up at dawn to bring you nature&apos;s finest harvests. 
        Each farmer has a unique story and a commitment to sustainable agriculture.
      </p>
      
      {/* Registration Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Register as a Farmer
          </Button>
        </DialogTrigger>
        <FarmerRegistrationModal />
      </Dialog>
    </motion.div>
  );
} 