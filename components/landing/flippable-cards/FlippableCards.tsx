"use client"

import { Check, Zap } from "lucide-react"
import { motion } from "framer-motion";
import { StaticImageData } from "next/image";
import { SunMoon } from "lucide-react"
import FeedbackCard from "./FlippableCard";
import transparentWidget from "../../../assets/transparentWidget.png"
import FakeOverview from "./FakeOverview";
import { ReactElement } from "react";

export interface CardData {
    icon: React.ElementType
    title: string
    description: string
    whenFlipped: StaticImageData | ReactElement;
}

const mockData: CardData[] = [
    {
        icon: Zap,
        title: "Feedback at a Glance",
        description: "Instantly visualize your feedback trends with our intuitive overview. Spot patterns, track improvements, and make data-driven decisions effortlessly.",
        whenFlipped: <FakeOverview />
    },
    {
        icon: SunMoon,
        title: "Adaptive Visuals",
        description: "Switch seamlessly between light and dark modes for optimal viewing comfort. Our widget adapts to your preferences and environment, ensuring clear readability in any lighting condition.",
        whenFlipped: transparentWidget
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

export default function FlippableCards() {
    return (
        <motion.div
            className="flex flex-col items-center gap-12 py-16 md::py-24 px-4 sm:px-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center gap-6 max-w-lg">
                <Badge />
                <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl md:max-w-lg">Easy to read feedbacks</motion.h1>
                <motion.p variants={itemVariants} className="">ChatGPT skriver endast outputs. Om vi ska vara ärliga så får du bara text av ChatGPT. Den arbetar inte självständigt och ansluter inte till program som är relevanta för dig.</motion.p>
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:gap-8">
                    <p className="inline-flex gap-1"><Check /> <span>Works in realtime</span></p>
                    <p className="inline-flex gap-1"><Check /> <span>Integrates into your systems</span></p>
                </motion.div>
                <motion.div variants={itemVariants}>

                </motion.div>
            </motion.div>
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 md:p-4"
            >
                {mockData.map((cardData, index) => (
                    <motion.div variants={itemVariants} key={index} className="w-full col-span-1 h-full">
                        <FeedbackCard data={cardData} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}

const Badge = () => {
    return (
        <div className="border p-2 px-4 gap-2 inline-flex rounded-full">
            <h1 className="text-sm">Feedbacks</h1>
        </div>
    )
}