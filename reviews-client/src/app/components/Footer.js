// src/app/components/Footer.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    RiLayoutGridLine,
    RiBarChartLine,
    RiUserLine,
    RiLogoutBoxLine,
    RiBook2Line
} from "react-icons/ri";
import { fetchWithAutoRefresh } from "@/src/app/libs/fetch";

export default function Footer() {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithAutoRefresh("/api/auth/me", { credentials: "include" })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("unauth");
            })
            .then(data => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    if (loading) {
        // пока идёт проверка — ничего не рисуем
        return null;
    }

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    const nav = [
        { href: "/dashboard", label: "Виджеты",   Icon: RiLayoutGridLine },
        { href: "/analytics", label: "Аналитика", Icon: RiBarChartLine },
        { href: "/reports",   label: "Жалобы",    Icon: RiBook2Line },
        { href: "/profile",   label: "Профиль",   Icon: RiUserLine },
    ];

    return (
        <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-white/30 backdrop-blur-md
            px-8 py-3 flex items-center justify-center
            space-x-8 shadow-lg z-10">
            {user ? (
                <>
                    {nav.map(({ href, label, Icon }) => {
                        const active = pathname.startsWith(href);
                        const color = active
                            ? "text-[#0f172a]"
                            : "text-[#0f172a]/50 group-hover:text-[#0f172a]";
                        return (
                            <Link
                                key={href}
                                href={href}
                                className="group flex flex-col items-center"
                            >
                                <Icon className={`w-6 h-6 transition ${color}`} />
                                <span className={`mt-1 text-sm transition ${color}`}>{label}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={handleLogout}
                        className="group flex flex-col items-center"
                    >
                        <RiLogoutBoxLine
                            className="w-7 h-7 text-[#0f172a]/50 group-hover:text-[#0f172a] transition"
                        />
                        <span className="mt-1 text-sm text-[#0f172a]/50 group-hover:text-[#0f172a] transition">
                            Выход
                        </span>
                    </button>
                </>
            ) : (
                <>
                    <Link
                        href="/login"
                        className="px-4 py-2 bg-[#0f172a] text-white rounded-lg hover:bg-[#0f172a]/90 transition"
                    >
                        Войти
                    </Link>
                    <Link
                        href="/register"
                        className="px-4 py-2 border border-[#0f172a] text-[#0f172a] rounded-lg hover:bg-[#0f172a]/5 transition"
                    >
                        Зарегистрироваться
                    </Link>
                </>
            )}
        </footer>
    );
}
