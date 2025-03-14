"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Check if the current path should show header
  const shouldShowHeader =
    !pathname?.startsWith("/Admin") &&
    !pathname?.startsWith("/Farmer") &&
    pathname !== "/login" &&
    pathname !== "/register";

  return (
    <>
      {shouldShowHeader && <Header />}
      <main>{children}</main>
    </>
  );
} 