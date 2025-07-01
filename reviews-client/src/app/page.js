// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RiArchiveFill, RiBarChart2Fill } from "react-icons/ri";
import { fetchWithAutoRefresh } from "@/src/app/libs/fetch";

export default function Home() {
    // undefined - ещё проверяем, null - неавторизован, object - авторизован
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        fetchWithAutoRefresh("/api/auth/me", { credentials: "include" })
            .then(res => (res.ok ? res.json() : null))
            .then(data => setUser(data?.user ?? null))
            .catch(() => setUser(null));
    }, []);

    return (
        <div className="relative flex flex-col min-h-screen bg-gray-50 text-gray-900 justify-center">
            <section className="flex flex-col items-center justify-center py-24 sm:py-32">
                <div className="mb-6 flex items-center gap-3">
                    <RiArchiveFill className="h-10 w-10 text-[#0f172a]" />
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#0f172a]">
                        Сервис виджетов отзывов
                    </h1>
                    <RiBarChart2Fill className="h-10 w-10 text-[#0f172a]" />
                </div>

                <p className="max-w-xl text-center text-lg text-[#0f172a]/70">
                    Единая панель для сбора и анализа отзывов вашей аудитории.
                </p>

                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                    {user === undefined ? null : user ? (
                        <Link
                            href="/dashboard"
                            className="inline-block rounded-md bg-[#0f172a] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#0f172a]/90"
                        >
                            Перейти в панель
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/register"
                                className="inline-block rounded-md bg-[#0f172a] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#0f172a]/90"
                            >
                                Зарегистрироваться
                            </Link>
                            <Link
                                href="/login"
                                className="inline-block rounded-md border border-[#0f172a] px-8 py-3 text-sm font-medium text-[#0f172a] transition hover:bg-[#0f172a]/5"
                            >
                                Войти
                            </Link>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
