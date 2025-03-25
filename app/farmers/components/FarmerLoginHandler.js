'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FarmerLoginHandler() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token && user.role === 'farmer') {
      if (user.isVerified) {
        router.push('/Farmer/Farmer-Dashboard');
      } else {
        router.push('/Farmer/pending-verification');
      }
    }
  }, [router]);

  return null;
} 