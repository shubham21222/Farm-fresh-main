import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import { AuthProvider } from "./hooks/useAuth";
import ClientLayout from "./components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
