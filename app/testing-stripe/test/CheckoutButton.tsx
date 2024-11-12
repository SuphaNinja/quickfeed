'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutButton({ priceId, planType }: { priceId: string, planType: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const createCheckoutSession = async (priceId: string) => {
        const response = await axios.post('/api/auth/stripe/checkout-session', { priceId, planType })
        return response.data
    }

    const mutation = useMutation({
        mutationFn: createCheckoutSession,
        onSuccess: async (data) => {
            const stripe = await stripePromise
            if (stripe) {
                const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
                if (error) {
                    console.error('Stripe checkout error:', error)
                }
            }
        },
        onError: (error) => {
            console.error('Error creating checkout session:', error)
        },
        onSettled: () => {
            setIsLoading(false)
        }
    })

    const handleCheckout = async () => {
        setIsLoading(true)
        mutation.mutate(priceId)
    }

    return (
        <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            aria-live="polite"
        >
            <span className="sr-only">{isLoading ? 'Loading subscription process' : 'Subscribe now'}</span>
            <span aria-hidden="true">{isLoading ? 'Loading...' : 'Subscribe Now'}</span>
        </button>
    )
}