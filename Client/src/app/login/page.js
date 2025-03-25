"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { login, clearError } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated, role, user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, role, user }); // Debug log
    
    if (isAuthenticated && user) {
      // Redirect based on user role
      switch (role) {
        case "admin":
          router.push("/Admin/dashboard");
          break;
        case "farmer":
          router.push("/Farmer/dashboard");
          break;
        default:
          router.push("/");
      }
    }
  }, [isAuthenticated, role, router, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    try {
      console.log('Submitting login form:', formData); // Debug log
      const result = await dispatch(login(formData)).unwrap();
      console.log('Login result:', result); // Debug log
      
      if (result.success) {
        toast.success("Login successful!");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16 pt-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
          >
            <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
              Welcome Back
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="text-green-600 hover:text-green-700">
                  Register here
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LoginPage; 