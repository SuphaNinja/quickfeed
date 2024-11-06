'use client'

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function ToggleTheme() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => setMounted(true), [])

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    if (!mounted) return null

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative w-9 h-9 rounded-full"
            aria-label="Toggle theme"
        >
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={false}
                animate={{
                    rotate: theme === "light" ? 0 : 180,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-[45deg] scale-0 transition-all dark:rotate-[75deg] dark:scale-100" />
            </motion.div>
        </Button>
    )
}