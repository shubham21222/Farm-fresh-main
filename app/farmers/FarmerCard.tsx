import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Farmer {
  id: string;
  name: string;
  location: string;
  image: string;
  specialty: string;
  experience: string;
  description: string;
}

interface FarmerCardProps {
  farmer: Farmer;
  index: number;
}

const FarmerCard = ({ farmer, index }: FarmerCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group relative bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300"
    >
      {/* Farmer Image with Gradient Overlay */}
      <div className="relative h-96">
        <Image
          src={farmer.image}
          alt={farmer.name}
          width={400}
          height={500}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300"></div>
        
        {/* Farmer Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h2 className="text-3xl font-bold text-white mb-2">{farmer.name}</h2>
          <div className="flex items-center text-green-300 mb-3">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{farmer.location}</span>
          </div>
          
          <div className="space-y-2 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <p className="text-lg font-semibold">Specialty: {farmer.specialty}</p>
            <p className="text-sm">{farmer.experience} of Experience</p>
            <p className="text-sm italic">{farmer.description}</p>
            <Link
              href={`/farmers/${farmer.id}`}
              className="inline-block mt-4 px-6 py-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-800 transition-all rounded-md"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FarmerCard; 