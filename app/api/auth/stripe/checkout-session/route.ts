import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {

  const { userId } = await auth();

  try {
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { priceId, planType } = await req.json();

    if (!planType) {
      return new NextResponse("No planType", { status: 401 });
    }
    if (!priceId) {
      return new NextResponse("No priceId ", { status: 401 });
    }
    // Create a Stripe customer with Clerk's userId in metadata
    const customer = await stripe.customers.create({
      metadata: {
        clerkUserId: userId,
        planType: planType
      }
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/canceled`,
      subscription_data: {
        metadata: {
          clerkUserId: userId,
        planType: planType
        }
      },
      metadata: {
        clerkUserId: userId,
        planType: planType
      }
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}