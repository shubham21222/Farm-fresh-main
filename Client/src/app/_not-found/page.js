"use client";

import Link from "next/link";

export default function NotFound() {
  if (typeof window === "undefined") return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">404 - Page Not Found</h1>
        <p className="mt-4 text-gray-600">Sorry, we couldn’t find that page.</p>
        <Link href="/" className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Go Home
        </Link>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';