"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Check, Cpu, LayoutDashboard, LucideIcon, MessageCircle } from "lucide-react"
import Link from "next/link";
import { motion } from "framer-motion";

interface MockDataProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

const mockData: MockDataProps[] = [
    {
        icon: MessageCircle,
        title: "Customer Feedback Collection",
        description: "Collect feedback effortlessly with QuickFeed's widget. Get direct insights from customers, right when it matters most."
    },
    {
        icon: LayoutDashboard,
        title: "Feedback Dashboard",
        description: "Access all feedback in one organized dashboard. QuickFeed makes it easy to view and manage every response."
    },
    {
        icon: Cpu,
        title: "AI-Powered Feedback Analysis",
        description: "With one click, let AI highlight what`s working and what needs improvement. Say goodbye to manual analysis."
    },
    {
        icon: BarChart3,
        title: "Instant Performance Summary",
        description: "QuickFeed`s AI summarizes key insights instantly, helping you make data-driven decisions at a glance."
    },
]

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    }
};

export default function KeyFeatures() {
    return (
        <motion.div
            className="flex md:flex-row flex-col gap-12 justify-between py-16 sm:py-24 px-2 sm:px-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <motion.div variants={itemVariants} className="flex flex-col gap-6 max-w-lg">
                <Badge />
                <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl md:max-w-md">Seamless Feedback, Supercharged Insights! 🚀</motion.h1>
                <motion.p variants={itemVariants} className="">QuickFeed`s AI simplifies customer feedback collection, analysis, and insights so you can focus on what matters most—improving your business.</motion.p>
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between max-w-sm">
                    <p className="inline-flex gap-1"><Check /> <span>Real-Time Feedback</span></p>
                    <p className="inline-flex gap-1"><Check /> <span>Instant Insights</span></p>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Button asChild className="bg-[#343A40] dark:bg-[#E2E2E2] mr-auto rounded-full" >
                        <Link href={"/sign-up"}>
                            Get Started
                            <span className="ml-2"><ArrowRight className="size-4" /></span>
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
            >
                {mockData.map((card, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className="bg-[#EDF0F2] dark:bg-[#0F0F11] flex flex-col gap-4 p-6 md:max-w-xs rounded-xl"
                    >
                        <h1 className="inline-flex gap-2"><card.icon /> {card.title}</h1>
                        <p>{card.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}

const Badge = () => {
    return (
        <div className="border p-2 px-4 gap-2 inline-flex mr-auto rounded-full">
            <h1 className="text-sm">QuickFeed</h1>
        </div>
    )
}