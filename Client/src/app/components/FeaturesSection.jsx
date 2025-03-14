import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const FeaturesSection = ({ featuredRef }) => {
  const features = [
    { title: "Fresh Products", description: "100% organic and fresh", icon: "🌱", color: "bg-green-100" },
    { title: "Free Delivery", description: "On orders over $50", icon: "🚚", color: "bg-blue-100" },
    { title: "Secure Payment", description: "100% secure checkout", icon: "🔒", color: "bg-purple-100" },
    { title: "24/7 Support", description: "Always here to help", icon: "💬", color: "bg-orange-100" },
  ];

  return (
    <section className="py-16" ref={featuredRef}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className={`border-none shadow-lg ${feature.color}`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;