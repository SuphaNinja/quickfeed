'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutButton({ priceId }: { priceId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCheckout = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });

            const { sessionId } = await response.json();
            const stripe = await stripePromise;

            const { error } = await stripe!.redirectToCheckout({ sessionId });

            if (error) {
                console.error('Stripe checkout error:', error);
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            {isLoading ? 'Loading...' : 'Subscribe Now'}
        </button>
    );
}