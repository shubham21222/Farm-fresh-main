"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./hooks/useAuth";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Check if the current path should show header
  const shouldShowHeader =
    !pathname?.startsWith("/Admin") &&
    !pathname?.startsWith("/Farmer") &&
    pathname !== "/login" &&
    pathname !== "/register";

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {shouldShowHeader && <Header />}
          <main>{children}</main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
