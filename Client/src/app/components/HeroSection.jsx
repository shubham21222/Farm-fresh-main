import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Floating animation for bounce effect
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const HeroSection = () => {
  // Array of images for the carousel
  const carouselImages = [
    {
      src: "/Tomato2.png",
      alt: "Fresh Tomatoes"
    },
    {
      src: "/eggs2.png",
      alt: "Fresh Eggs"
    },
    {
      src: "/Vegetables2.png",
      alt: "Fresh Vegetables"
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-green-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-[70px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 sm:space-y-6 text-center md:text-left"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Get the Fresh Food from our Agro Market
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0">
              Direct from local farmers to your table. Fresh, organic, and
              sustainably grown produce.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                Shop Now
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mt-8 w-full">
            <Swiper
              style={{ height: "100%", width: "100%" }}
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={true}
              className="w-full h-full"
            >
              {carouselImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    variants={floatingAnimation}
                    initial="initial"
                    animate="animate"
                    className="relative h-full w-full"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="object-contain rounded-2xl w-full h-full"
                    />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
