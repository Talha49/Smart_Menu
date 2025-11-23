'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSyncSession } from '@/hooks/use-sync-session';
import { useAuthStore } from '@/lib/store';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toastSuccess, toastError } from '@/lib/toast';
import { Check, CreditCard, Lock, ArrowLeft, Sparkles } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, status } = useSyncSession();
  const { update: updateSession } = useSession();
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const plan = useAuthStore((state) => state.plan);
  const updatePlan = useAuthStore((state) => state.updatePlan);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Get sessionId from URL if present
    const urlSessionId = searchParams.get('sessionId');
    if (urlSessionId) {
      setSessionId(urlSessionId);
    }
  }, [searchParams]);

  // Redirect if already Pro
  useEffect(() => {
    if (status === 'loading') return;
    if (plan === 'pro') {
      router.push('/dashboard');
    }
  }, [plan, status, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !restaurantId) {
      router.push('/auth/login');
    }
  }, [session, status, restaurantId, router]);

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);

      // Create checkout session
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      console.log('Checkout API response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      // Set session ID and proceed to payment
      if (data.sessionId) {
        console.log('Setting sessionId:', data.sessionId);
        setSessionId(data.sessionId);
        setIsProcessing(false); // Reset processing state to show payment form
      } else {
        console.error('No sessionId in response:', data);
        throw new Error('No session ID received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toastError(error.message || 'Failed to start checkout');
      setIsProcessing(false);
    }
  };

  const handleMockPayment = async () => {
    if (!sessionId) {
      toastError('No checkout session found');
      return;
    }

    try {
      setIsProcessing(true);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call success handler
      const response = await fetch('/api/payment/success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Payment API error:', data);
        throw new Error(data.message || 'Payment failed');
      }

      console.log('Payment successful:', data);

      // Update Zustand store
      updatePlan('pro');

      // Refresh NextAuth session to get updated plan
      await updateSession();

      // Show success message
      toastSuccess('Successfully upgraded to Pro plan! 🎉');

      // Redirect to dashboard with success message
      setTimeout(() => {
        window.location.href = '/dashboard?upgraded=true';
      }, 500);
    } catch (error) {
      console.error('Payment error:', error);
      toastError(error.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  // Show loading state
  if (status === 'loading' || !session || !restaurantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upgrade to Pro</h1>
          <p className="text-gray-600">Unlock all premium features</p>
        </div>

        {/* Payment Card */}
        <Card className="p-6 sm:p-8 border-2 border-gray-200">
          {!sessionId ? (
            // Checkout Initiation
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Pro Plan Features</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Unlimited menu items</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Remove "Powered by SmartMenu" watermark</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Upload custom logo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Custom brand colors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Full menu customization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">$9.99</span>
                  <span className="text-sm text-gray-500">per month</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 cursor-pointer"
                  size="lg"
                >
                  {isProcessing ? 'Processing...' : 'Continue to Payment'}
                </Button>
              </div>
            </div>
          ) : (
            // Payment Form (Mock)
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock className="h-4 w-4" />
                <span>Secure payment (Mock Mode)</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled
                      defaultValue="4242 4242 4242 4242"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="12/25"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled
                      defaultValue="12/25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled
                      defaultValue="123"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">$9.99</span>
                </div>
                <Button
                  onClick={handleMockPayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 cursor-pointer"
                  size="lg"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Payment...
                    </span>
                  ) : (
                    'Complete Payment'
                  )}
                </Button>
                <p className="text-xs text-center text-gray-500 mt-3">
                  This is a mock payment. No real charges will be made.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a mock payment system for testing. In production, this will integrate with Stripe for secure payments.
          </p>
        </div>
      </div>
    </div>
  );
}

