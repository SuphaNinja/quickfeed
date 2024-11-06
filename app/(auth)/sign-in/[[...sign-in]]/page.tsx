"use client"

import config from "@/config";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const router = useRouter()

    if (!config?.auth?.enabled) {
        router.back()
    }

    return (
        <div >
            <div className="flex min-w-screen justify-center my-[5rem]">
                <SignIn fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/dashboard" />
            </div>
        </div>
    );
}