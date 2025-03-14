import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const products = [
  { name: "Fresh Bananas", price: "4.99", image: "/placeholder.svg?height=200&width=200", badge: "Sale", category: "fruits" },
  { name: "Organic Tomatoes", price: "3.99", image: "/placeholder.svg?height=200&width=200", category: "vegetables" },
  { name: "Sweet Oranges", price: "5.99", image: "/placeholder.svg?height=200&width=200", badge: "New", category: "fruits" },
  { name: "Red Apples", price: "2.99", image: "/placeholder.svg?height=200&width=200", category: "fruits" },
  { name: "Fresh Broccoli", price: "3.49", image: "/placeholder.svg?height=200&width=200", category: "vegetables" },
  { name: "Organic Carrots", price: "2.49", image: "/placeholder.svg?height=200&width=200", category: "vegetables" },
  { name: "Green Lettuce", price: "1.99", image: "/placeholder.svg?height=200&width=200", category: "vegetables" },
  { name: "Fresh Strawberries", price: "6.99", image: "/placeholder.svg?height=200&width=200", badge: "Popular", category: "fruits" },
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6" ref={productsRef}>
          {products.map((product, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05, y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="group overflow-hidden">
                <CardContent className="p-4">
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    {product.badge && <Badge className="absolute top-2 right-2 z-10">{product.badge}</Badge>}
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