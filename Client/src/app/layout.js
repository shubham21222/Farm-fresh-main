"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthProvider } from "./hooks/useAuth";
import ClientLayout from "./components/ClientLayout";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <AuthProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
            <Toaster position="top-right" />
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
