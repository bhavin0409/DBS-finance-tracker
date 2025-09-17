import Link from "next/link";
import React from "react";

export default function Footer() {
    return (
        <footer className="bg-white text-black pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Brand */}
                    <div>
                        <h2 className="text-6xl text-center font-bold gradient-title">Welth</h2>
                        <p className="mt-2 text-lg text-center text-gray-600">
                            Track, analyze, and optimize your finances with real-time insights.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex justify-center flex-col items-center">
                        <h3 className="text-lg font-semibold text-black mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link></li>
                            <li><Link href="/transactions/create" className="hover:text-gray-700">Add Transactions</Link></li>
                        </ul>
                    </div>

                    
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} FinTrack. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
