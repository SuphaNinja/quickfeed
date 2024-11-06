"use client"

import { motion } from "framer-motion"
import PricingCard from "@/components/landing/pricing/PricingCard"

export type PricingPlan = {
    title: string
    price: number
    description: string
    isPopular: boolean
    features: string[]
    url: string
}

export const pricingPlans: PricingPlan[] = [
    {
        title: "Free",
        price: 0,
        description: "For small teams just getting started",
        isPopular: false,
        url: "/dashboard",
        features: [
            "1 project",
            "Unlimited feedbacks",
            "Feedback overview",
            "Priority support",
        ],
    },
    {
        title: "Monthly",
        price: 19.99,
        description: "For growing teams",
        isPopular: true,
        url: "/payments/subscribe?plan=monthly",
        features: [
            "Unlimited projects",
            "Unlimited feedbacks",
            "AI-analytcs & overview",
            "Priority support",
        ],
    },
    {
        title: "Yearly",
        price: 199.99,
        description: "Upgrade to save more!",
        isPopular: false,
        url: "/payments/subscribe?plan=yearly",
        features: [
            "Unlimited projects",
            "Unlimited feedbacks",
            "AI-analytcs & overview",
            "Priority support",
        ],
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
}

const Pricing = () => {
    return (
        <motion.div
            id="pricing"
            className="text-center py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            <motion.h2 variants={itemVariants} className="text-3xl text-blue-500">
                Pricing
            </motion.h2>
            <motion.h1 variants={itemVariants} className="text-3xl mb-8 pt-3">
                Flexible Pricing to Fit Your Needs
            </motion.h1>
            <motion.div
                className="mt-10 grid items-center grid-cols-1 gap-3 md:grid-cols-3 max-w-screen-xl mx-auto"
                variants={containerVariants}
            >
                {pricingPlans.map((plan, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <PricingCard {...plan} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}

export default Pricing