"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const PendingVerificationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Account Pending Verification
        </h1>
        
        <p className="text-gray-600 mb-8">
          Your farmer account is currently under review. Our admin team will verify your account shortly. 
          You'll receive an email notification once your account is verified.
        </p>
        
        <div className="space-y-4">
          <Button
            asChild
            variant="outline"
            className="w-full border-green-600 text-green-600 hover:bg-green-50"
          >
            <Link href="/">
              Return to Home
            </Link>
          </Button>
          
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at support@farmfresh.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingVerificationPage; 