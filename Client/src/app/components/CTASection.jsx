import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-green-400 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Start Shopping Fresh Today</h2>
        <p className="mb-8 text-lg opacity-90">Join thousands of happy customers and experience the difference</p>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-green-50">
            Shop Now
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;