"use client";

import { Check, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PricingPlan } from "./Pricing";

export default function PricingCard({
    title,
    price,
    description,
    features,
    isPopular,
    url,
}: PricingPlan) {
    const router = useRouter();

    const onClick = () => {
        router.push(url);
    };

    const isYearly = title.toLowerCase().includes("yearly");

    return (
        <div
            className={`
      relative flex flex-col justify-between h-full rounded-xl
      shadow-md transition-all duration-300 hover:shadow-xl 
      bg-[#EDF0F2] dark:bg-[#0F0F11]
      border-[#CED4DA] dark:border-[#131314] border
      ${isPopular && "shadow-2xl"}
    `}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#343A40] dark:bg-[#E2E2E2] text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                    <Star className="w-4 h-4" /> Most Popular
                </div>
            )}
            <div className="space-y-6 p-6 pt-8">
                <div>
                    <h1 className="font-bold text-2xl">{title}</h1>
                    <p className="text-sm mt-2">{description}</p>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-baseline">
                        <h1 className="text-4xl font-semibold ">
                            ${price.toFixed(2)}
                        </h1>
                        <span className="ml-1 text-sm ">
                            {isYearly ? "/year" : price !== 0 ? "/month" : ""}
                        </span>
                        {isYearly && (
                            <div className="text-xs text-green-500 ml-auto mt-1">
                                17% discount
                            </div>
                        )}
                    </div>
                </div>
                <ul className="space-y-3">
                    {features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-6 pt-0">
                <Button
                    onClick={onClick}
                    className={`w-full bg-[#343A40] dark:bg-[#E2E2E2] rounded-full `}
                >
                    <span className="">Get Started</span>
                </Button>
            </div>
        </div>
    );
}
