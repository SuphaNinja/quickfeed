"use client"

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap } from "lucide-react"
import scrollToId from "@/animations/scrollToId";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0
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

export default function Hero() {

    return (
        <motion.main
            className="flex flex-col items-center gap-4 h-[calc(100vh-180px)] justify-center z-[999]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="flex items-center flex-col md:gap-4 gap-2"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Badge />
                </motion.div>
                <motion.h1
                    variants={itemVariants}
                    className="md:text-7xl text-2xl text-center sm:text-2xl"
                >
                    AI powered feedback<br />
                    collection built into your app
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="text-slate-300 md:text-base text-sm text-center max-w-xl"
                >
                    Collect feedback, visualize insights, and drive growth with data-driven decisions.
                </motion.p>
            </motion.div>

            <motion.div
                className="flex gap-4 md:mt-5"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Link href="/sign-up">
                        <Button variant="outline" className="border-[#3333] bg-blue-500 hover:text-white text-white hover:bg-blue-500 hover:opacity-90 hover:scale-105 rounded-full">
                            Get Started
                        </Button>
                    </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Button onClick={() => scrollToId("pricing")} variant="outline" className="rounded-full bg-transparent border-gray-300  dark:border-[#303030] hover:opacity-90 hover:bg-transparent">
                        Pricing
                    </Button>
                </motion.div>
            </motion.div>
        </motion.main>
    );
}

const Badge = () => {
    return (
        <div className="border py-2 px-3 md:py-4 md:px-6 gap-2 inline-flex rounded-full">
            <Zap className="w-6 h-6" />
            <h1 className=" md:text-xl">Get your AI-assistant</h1>
        </div>
    )
}