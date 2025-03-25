import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ProductsSection from './components/ProductsSection';
import CategoriesSection from './components/CategoriesSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import CounterSection from './components/CounterSection';
import ProductCarousel from './components/ProductCarousel';
import Header from './components/Header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
    <Header />
      <main className="flex-1 pt-16">
        <HeroSection />
        <FeaturesSection />
        <ProductCarousel />
        <ProductsSection />
        <CategoriesSection />
        <CounterSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}