"use client"

import { useState } from "react"
import Image from "next/image"
import { Repeat } from "lucide-react"
import { CardData } from "./FlippableCards"

export default function FlippableCard({ data }: { data: CardData }) {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    const Icon = data.icon

    return (
        <div className="group md:h-96 md:w-96 h-80 w-80">
            <div
                className="relative h-full w-full rounded-xl transition-all duration-500 [transform-style:preserve-3d] cursor-pointer"
                onClick={handleFlip}
                style={{
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* Front Face */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-[#EDF0F2] dark:bg-[#0F0F11] [backface-visibility:hidden] duration-300">
                    <div className="flex flex-col items-center justify-center h-full p-6">
                        <Icon className="w-16 h-16 mb-4" />
                        <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
                        <p className="text-center">{data.description}</p>
                        <Repeat className="w-5 h-5 absolute bottom-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                    </div>
                </div>
                {/* Back Face */}
                <div className="absolute flex items-center justify-center inset-0 h-full w-full rounded-xl bg-[#EDF0F2] dark:bg-[#0F0F11] [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden duration-300">
                    {typeof data.whenFlipped === 'object' && 'src' in data.whenFlipped ? (
                        <Image
                            src={data.whenFlipped}
                            alt={`${data.title} image`}
                            className="rounded-xl cover"
                        />
                    ) : (
                        <div className="">
                            {data.whenFlipped}
                        </div>
                    )}
                    <Repeat className="w-5 h-5 absolute bottom-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                </div>
            </div>
        </div>
    )
}