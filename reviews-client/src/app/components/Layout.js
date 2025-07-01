// src/app/components/Layout.js
'use client';

import Footer from "@/src/app/components/Footer";

export default function Layout({ children }) {
    return (
        <div className="relative flex flex-col min-h-screen bg-gray-50 text-gray-900">
            <main className="flex-1 pb-16 px-6 py-10 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
