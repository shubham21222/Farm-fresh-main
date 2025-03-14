"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ProductsSection from './components/ProductsSection';
import CategoriesSection from './components/CategoriesSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import CounterSection from './components/CounterSection';
import ProductCarousel from './components/ProductCarousel';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const featuredRef = useRef(null);
  const productsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    gsap.from(featuredRef.current?.children || [], {
      scrollTrigger: { trigger: featuredRef.current, start: "top center", end: "bottom center" },
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
    });

    gsap.from(productsRef.current?.children || [], {
      scrollTrigger: { trigger: productsRef.current, start: "top center", end: "bottom center" },
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
    });

    gsap.from(testimonialsRef.current?.children || [], {
      scrollTrigger: { trigger: testimonialsRef.current, start: "top center", end: "bottom center" },
      x: -50,
      opacity: 0,
      duration: 1,
      stagger: 0.3,
    });

    gsap.from(counterRef.current?.children || [], {
      scrollTrigger: { trigger: counterRef.current, start: "top center", end: "bottom center" },
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-16">
        <HeroSection />
        <FeaturesSection featuredRef={featuredRef} />
        <ProductCarousel />
        <ProductsSection productsRef={productsRef} />
        <CategoriesSection />
        <CounterSection />
        <TestimonialsSection testimonialsRef={testimonialsRef} />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}