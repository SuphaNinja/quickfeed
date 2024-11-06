import React from "react"
import { Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full border-t border-[#CED4DA] dark:border-[#131314] mt-24 bg-[#EDF0F2] dark:bg-[#0F0F11] text-gray-800 dark:text-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-12 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold">Quick<span className="text-blue-500">Feed</span></h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                                Empowering businesses with real-time insights and analytics for informed decision-making.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-sm dark:hover:text-gray-400 hover:text-gray-600 transition-colors">Home</Link></li>
                                <li><Link href="#" className="text-sm dark:hover:text-gray-400 hover:text-gray-600 transition-colors">Services</Link></li>
                                <li><Link href="#" className="text-sm dark:hover:text-gray-400 hover:text-gray-600 transition-colors">About</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Contact Us</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">123 Business St, City, Country</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">+1 (123) 456-7890</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">contact@quickfeed.com</span>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Social Links</h3>
                            <div className="flex space-x-2">
                                <Link
                                    className="text-sm hover:text-gray-400 transition-colors"
                                    href="https://www.linkedin.com/company/quickfeed/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn">LinkedIn</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-[#CED4DA] dark:border-[#131314] py-6 flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {currentYear} QuickFeed AB. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        <Link href="#" className="text-sm dark:hover:text-gray-400 hover:text-gray-600 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-sm dark:hover:text-gray-400 hover:text-gray-600 transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}