'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmail } from '../lib/auth';
import toast from 'react-hot-toast';

// Create a client component for the verification content
const VerifyEmailContent = () => {
  const [verifying, setVerifying] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        toast.error('Invalid verification link');
        router.push('/login');
        return;
      }

      try {
        const response = await verifyEmail(token);
        console.log('Verification response:', response);
        
        if (response.token && response.user) {
          // Store the authentication data
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          toast.success('Email verified successfully! You are now logged in.');
          router.push('/my-account'); // Redirect to user dashboard or account page
        } else {
          toast.error('Verification successful but login failed. Please log in manually.');
          router.push('/login');
        }
      } catch (error) {
        console.error('Verification failed:', error);
        toast.error(error.response?.data?.message || 'Failed to verify email. Please try again.');
        router.push('/login');
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Verifying your email</h2>
          <p className="mt-2 text-gray-600">
            {verifying ? 'Please wait while we verify your email...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main page component
export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Loading...</h2>
            <p className="mt-2 text-gray-600">Please wait while we process your request...</p>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 