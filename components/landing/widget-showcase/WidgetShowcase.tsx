"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import widget from "../../../assets/transparentWidget.png"

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

export default function WidgetShowcase() {
    return (
        <motion.div
            className="flex md:flex-row flex-col-reverse gap-12 justify-between py-16 sm:py-24 px-4 sm:px-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <motion.div
                variants={containerVariants}
                className="bg-[#EDF0F2] dark:bg-[#0F0F11] border border-[#CED4DA] dark:border-[#131314] md:ml-8 rounded-xl"
            >
                <Image
                    src={widget}
                    alt="Image of widget"
                    width={400}
                    height={400}
                />
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col gap-6 max-w-lg">
                <Badge />
                <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl md:max-w-lg">Light or Dark? You Choose the Vibe! ⚡️</motion.h1>
                <motion.p variants={itemVariants} className="">Customize the QuickFeed widget to match your brand`s aesthetic. Whether you prefer a sleek dark mode or a bright light mode, we`ve got you covered for a seamless user experience.</motion.p>
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between max-w-md">
                    <p className="inline-flex gap-1"><Check /> <span>Stylish Customization</span></p>
                    <p className="inline-flex gap-1"><Check /> <span>User-Friendly Experience</span></p>
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