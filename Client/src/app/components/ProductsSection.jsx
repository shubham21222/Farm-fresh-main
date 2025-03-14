import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const products = [
  { 
    name: "Fresh Bananas", 
    price: "4.99", 
    image: "https://images.unsplash.com/photo-1543218024-57a70143c369?w=500&h=500&fit=crop", 
    badge: "Sale", 
    category: "fruits" 
  },
  { 
    name: "Organic Tomatoes", 
    price: "3.99", 
    image: "https://images.unsplash.com/photo-1546470427-f5d8c4edf3e2?w=500&h=500&fit=crop", 
    category: "vegetables" 
  },
  { 
    name: "Sweet Oranges", 
    price: "5.99", 
    image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&h=500&fit=crop", 
    badge: "New", 
    category: "fruits" 
  },
  { 
    name: "Red Apples", 
    price: "2.99", 
    image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500&h=500&fit=crop", 
    category: "fruits" 
  },
  { 
    name: "Fresh Broccoli", 
    price: "3.49", 
    image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=500&h=500&fit=crop", 
    category: "vegetables" 
  },
  { 
    name: "Organic Carrots", 
    price: "2.49", 
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop", 
    category: "vegetables" 
  },
  { 
    name: "Green Lettuce", 
    price: "1.99", 
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&h=500&fit=crop", 
    category: "vegetables" 
  },
  { 
    name: "Fresh Strawberries", 
    price: "6.99", 
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop", 
    badge: "Popular", 
    category: "fruits" 
  },
];

const ProductsSection = ({ productsRef }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground">Discover our selection of fresh fruits and vegetables</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" ref={productsRef}>
          {products.map((product, index) => (
            <motion.div 
              key={index} 
              whileHover={{ scale: 1.05, y: -10 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="group overflow-hidden h-full">
                <CardContent className="p-4">
                  <div className="relative mb-4 overflow-hidden rounded-lg aspect-square">
                    {product.badge && (
                      <Badge className="absolute top-2 right-2 z-10">{product.badge}</Badge>
                    )}
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover"
                        unoptimized
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
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;