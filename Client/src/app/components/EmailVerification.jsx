import React, { useState } from 'react';
import { sendVerificationEmail, verifyEmail } from '../lib/auth';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

const EmailVerification = ({ userEmail, isVerified, onVerificationComplete }) => {
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSendVerification = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      await sendVerificationEmail();
      setVerificationSent(true);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast.error(error.response?.data?.error || 'Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <span>Email verified</span>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start space-x-3">
          <XCircle className="h-5 w-5 text-yellow-500 mt-1" />
          <div>
            <h4 className="font-medium text-yellow-800">Email not verified</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Please verify your email address ({userEmail}) to access all features.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleSendVerification}
            disabled={loading || verificationSent}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            <Mail className="h-4 w-4 mr-2" />
            {loading ? 'Sending...' : verificationSent ? 'Email Sent' : 'Send Verification Email'}
          </Button>
          
          {verificationSent && (
            <p className="text-sm text-yellow-700">
              Check your inbox and click the verification link.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 