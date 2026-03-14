'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type SessionStatus = 'idle' | 'running' | 'completed' | 'error';
type CheckoutStatus = 'idle' | 'loading' | 'redirecting';

interface PaymentIntent {
  id: string;
  client_secret: string;
  status: string;
  amount: number;
}

const RATE_PER_SECOND = 0.02; // $0.02 per second
const MINIMUM_CENTS = 50; // $0.50 minimum (Stripe requirement)
const MINIMUM_SECONDS = Math.ceil(MINIMUM_CENTS / (RATE_PER_SECOND * 100)); // 25 seconds

export default function BillingSession() {
  const t = useTranslations('billing');
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>('idle');

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCost = (seconds: number): number => {
    return seconds * RATE_PER_SECOND;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const startSession = useCallback(() => {
    setSessionStatus('running');
    setElapsedSeconds(0);
    setPaymentIntent(null);
    setError(null);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedSeconds(elapsed);
      }
    }, 100);
  }, []);

  const endSession = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsProcessing(true);

    // Calculate final amount in cents
    const costDollars = calculateCost(elapsedSeconds);
    const costCents = Math.round(costDollars * 100);

    try {
      const response = await fetch('/api/billing/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: costCents }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setPaymentIntent(data);
      setSessionStatus('completed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSessionStatus('error');
    } finally {
      setIsProcessing(false);
    }
  }, [elapsedSeconds]);

  const resetSession = useCallback(() => {
    setSessionStatus('idle');
    setElapsedSeconds(0);
    setPaymentIntent(null);
    setError(null);
    setCheckoutStatus('idle');
    startTimeRef.current = null;
  }, []);

  const handlePayNow = useCallback(async () => {
    if (!paymentIntent) return;

    setCheckoutStatus('loading');

    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentIntent.amount,
          paymentIntentId: paymentIntent.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      setCheckoutStatus('redirecting');

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate checkout');
      setCheckoutStatus('idle');
    }
  }, [paymentIntent]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const currentCost = calculateCost(elapsedSeconds);
  const showMinimumWarning = sessionStatus === 'running' && elapsedSeconds < MINIMUM_SECONDS;

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
        {t('title')}
      </h2>

      {/* Timer Display */}
      <div className="mb-6 text-center">
        <div className="font-mono text-6xl font-bold text-gray-900">
          {formatTime(elapsedSeconds)}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {t('rate', { rate: formatCurrency(RATE_PER_SECOND) })}
        </div>
      </div>

      {/* Running Cost Display */}
      <div className="mb-8 text-center">
        <div className="text-4xl font-semibold text-emerald-600">
          {formatCurrency(currentCost)}
        </div>
      </div>

      {/* Minimum Warning */}
      {showMinimumWarning && (
        <div className="mb-6 rounded-lg bg-amber-50 p-4 text-center text-amber-800">
          {t('minimumWarning', {
            minimum: formatCurrency(MINIMUM_CENTS / 100),
            seconds: MINIMUM_SECONDS,
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {sessionStatus === 'idle' && (
          <button
            onClick={startSession}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl"
          >
            {t('startSession')}
          </button>
        )}

        {sessionStatus === 'running' && (
          <button
            onClick={endSession}
            disabled={isProcessing}
            className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-red-600 hover:to-red-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? t('processing') : t('endSession')}
          </button>
        )}

        {(sessionStatus === 'completed' || sessionStatus === 'error') && (
          <button
            onClick={resetSession}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl"
          >
            {t('newSession')}
          </button>
        )}
      </div>

      {/* Success Card */}
      {sessionStatus === 'completed' && paymentIntent && (
        <div className="mt-8 rounded-xl bg-emerald-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-emerald-800">
            {t('paymentCreated')}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-emerald-700">{t('paymentId')}:</span>
              <code className="rounded bg-emerald-100 px-2 py-1 text-sm text-emerald-900">
                {paymentIntent.id}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">{t('amount')}:</span>
              <span className="font-semibold text-emerald-900">
                {formatCurrency(paymentIntent.amount / 100)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">{t('status')}:</span>
              <span className="rounded bg-emerald-200 px-2 py-1 text-sm font-medium text-emerald-900">
                {paymentIntent.status}
              </span>
            </div>
          </div>
          {/* Pay Now Button */}
          <div className="mt-6">
            <button
              onClick={handlePayNow}
              disabled={checkoutStatus !== 'idle'}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checkoutStatus === 'loading' && t('processing')}
              {checkoutStatus === 'redirecting' && t('redirecting')}
              {checkoutStatus === 'idle' && t('payNow')}
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {sessionStatus === 'error' && error && (
        <div className="mt-8 rounded-xl bg-red-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-red-800">
            {t('error')}
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
