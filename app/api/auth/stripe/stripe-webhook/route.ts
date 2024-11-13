import Stripe from "stripe"
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const sig = req.headers.get("Stripe-Signature")

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(deletedSubscription)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ status: "success", event })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ status: "Failed", error })
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const clerkUserId = subscription.metadata.clerkUserId
  const planType = subscription.metadata.planType
  if (!clerkUserId) {
    console.error(`No Clerk user ID found for Stripe customer: ${subscription.customer}`)
    return
  }
  
  const subscriptionData = {
    userId: clerkUserId,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer as string,
    status: subscription.status === "active" ? "active" : "inactive",
    planId: subscription.items.data[0].plan.id,
    subscriptionType: planType,
    amount: subscription.items.data[0].plan.amount ?? 0,
    createdAt: new Date(subscription.current_period_start * 1000),
    endsAt: new Date(subscription.current_period_end * 1000),
  }
console.log("SUBSCRIPTION: ",subscriptionData)
  await prisma.$transaction(async (prisma) => {

    await prisma.subscription.updateMany({
      where: {userId: clerkUserId},
      data: { status: "inactive"}
    })

    await prisma.subscription.create({
      data: subscriptionData
    })

    await prisma.user.update({
      where: { userId: clerkUserId },
      data: {
        isSubscribed: true,
        subscriptionType: planType,
        subscriptionEndsAt: subscriptionData.endsAt,
        hasHadTrial: true
      },
    })
  })

  console.log('Subscription and user updated:', subscriptionData.stripeSubscriptionId)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const clerkUserId = subscription.metadata.clerkUserId
  if (!clerkUserId) {
    console.error(`No Clerk user ID found for Stripe customer: ${subscription.customer}`)
    return
  }

  await prisma.$transaction(async (prisma) => {
    // Update the subscription status
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'inactive',
      },
    })

    // Update the user's subscription status
    await prisma.user.update({
      where: { userId: clerkUserId },
      data: {
        isSubscribed: false,
        subscriptionType: 'no subscription',
      },
    })
  })

  console.log('Subscription canceled and user updated:', subscription.id)
}