"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Globe, Phone, Mail, MapPin, Clock } from 'lucide-react';

const BrandPreview = ({ brand }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (brand?.businessHours) {
      const day = currentTime.getDay();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = days[day];
      const hours = brand.businessHours[today];
      
      if (hours?.open && hours?.close) {
        setIsOpen(currentTimeString >= hours.open && currentTimeString <= hours.close);
      }
    }
  }, [currentTime, brand?.businessHours]);

  if (!brand) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Brand Preview</h2>
      
      {/* Store Header */}
      <div 
        className="relative h-48 rounded-lg overflow-hidden mb-6"
        style={{ backgroundColor: brand.brandColors?.primary || '#4CAF50' }}
      >
        {brand.coverImage?.url && (
          <Image
            src={brand.coverImage.url}
            alt="Store Cover"
            fill
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {brand.logo?.url ? (
            <div className="relative w-32 h-32">
              <Image
                src={brand.logo.url}
                alt="Store Logo"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <h1 
              className="text-4xl font-bold text-white"
              style={{ fontFamily: brand.typography?.headingFont || 'Poppins' }}
            >
              {brand.storeName}
            </h1>
          )}
        </div>
      </div>

      {/* Store Information */}
      <div className="space-y-4">
        <div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ 
              fontFamily: brand.typography?.headingFont || 'Poppins',
              color: brand.brandColors?.primary || '#4CAF50'
            }}
          >
            {brand.storeName}
          </h2>
          <p 
            className="text-gray-600"
            style={{ fontFamily: brand.typography?.bodyFont || 'Inter' }}
          >
            {brand.storeDescription}
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">{brand.contactInfo?.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">{brand.contactInfo?.email}</span>
          </div>
          <div className="flex items-center space-x-2 md:col-span-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">{brand.contactInfo?.address}</span>
          </div>
        </div>

        {/* Business Hours */}
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
            <p className="text-sm text-gray-600 mt-1">
              {brand.businessHours?.[new Date().toLocaleLowerCase().slice(0, 3)]?.open} - 
              {brand.businessHours?.[new Date().toLocaleLowerCase().slice(0, 3)]?.close}
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex space-x-4">
          {brand.socialMedia?.facebook && (
            <a 
              href={brand.socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600"
            >
              <Facebook className="h-6 w-6" />
            </a>
          )}
          {brand.socialMedia?.instagram && (
            <a 
              href={brand.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-pink-600"
            >
              <Instagram className="h-6 w-6" />
            </a>
          )}
          {brand.socialMedia?.twitter && (
            <a 
              href={brand.socialMedia.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-400"
            >
              <Twitter className="h-6 w-6" />
            </a>
          )}
          {brand.socialMedia?.website && (
            <a 
              href={brand.socialMedia.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-600"
            >
              <Globe className="h-6 w-6" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandPreview; 