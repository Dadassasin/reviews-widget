// src/app/not-found.js

import Link from 'next/link';
import Layout from '@/src/app/components/Layout';
import { RiInboxLine } from 'react-icons/ri';

export default function NotFound() {
    return (
        <div className="relative flex flex-col min-h-screen bg-gray-50 text-gray-900 justify-center">
            <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
                <RiInboxLine className="text-6xl text-[#0f172a]/30"/>
                <h1 className="text-4xl font-bold text-[#0f172a]">404</h1>
                <p className="text-lg text-[#0f172a]/70">
                    Упс! Такая страница не найдена.
                </p>
                <Link href="/" className="mt-4 inline-block rounded-md bg-[#0f172a] px-6 py-2 text-white hover:bg-[#0f172a]/90 transition">
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
}
