import Stripe from "stripe"
import {NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
export async function POST(req: NextRequest,) {

    const payload = await req.text()
    const res = JSON.parse(payload)

    const sig = req.headers.get("Stripe-Signature");

    const dateTime = new Date(res?.created * 1000).toLocaleDateString()
    const timeString = new Date(res?.created * 1000).toLocaleDateString()

    try{
        let event = stripe.webhooks.constructEvent(
            payload,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        )

        console.log("event: ", event.type)

        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionChange(subscription);
                break;
            case 'customer.subscription.deleted':
                const deletedSubscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(deletedSubscription);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        return NextResponse.json({status: "success", event})
    } catch (error) {
        return NextResponse.json({status: "Failed", error})
    }
    
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  console.log("Customer Incoming: ",customer)
  console.log("SUBSCRIPTION: ", subscription)
  const clerkUserId = subscription.metadata.clerkUserId;
  if (!clerkUserId) {
    console.error(`No Clerk user ID found for Stripe customer: ${subscription.customer}`);
    return;
  }

  const subscriptionData = {
    userId: clerkUserId,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer as string,
    status: subscription.status,
    planId: subscription.items.data[0].plan.id,
    interval: subscription.items.data[0].plan.interval,
    amount: subscription.items.data[0].plan.amount,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
  };

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscriptionData.stripeSubscriptionId },
    update: subscriptionData,
    create: subscriptionData,
  });

  console.log('Subscription updated:', subscriptionData.stripeSubscriptionId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'canceled',
      canceledAt: new Date(),
    },
  });

  console.log('Subscription canceled:', subscription.id);
}