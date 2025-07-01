"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiMail,
    HiLockClosed,
    HiEye,
    HiEyeOff
} from "react-icons/hi";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail]           = useState("");
    const [password, setPassword]     = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading]   = useState(false);
    const [error, setError]           = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const params       = new URLSearchParams(window.location.search);
        const parentOrigin = params.get("origin") || "*";
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method:      "POST",
                headers:     { "Content-Type": "application/json" },
                credentials: "include",
                body:        JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Ошибка при входе");
                setIsLoading(false);
                return;
            }

            // Если окно открыто как popup
            if (window.opener) {
                window.opener.postMessage("LOGIN_SUCCESS", parentOrigin);
                window.close();
                return;
            }

            // Обычный режим
            router.push("/dashboard");
        } catch {
            setError("Сетевая ошибка");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center bg-[#0f172a]/10 rounded-full h-12 w-12 mb-2">
                        <HiLockClosed className="text-[#0f172a] h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#0f172a]">С возвращением</h1>
                    <p className="text-[#0f172a]">Введите данные для входа</p>
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-[#0f172a]">
                            Электронная почта
                        </label>
                        <div className="relative">
                            <HiMail className="absolute left-3 top-3 text-[#0f172a]/70" />
                            <input
                                type="email"
                                className="w-full pl-10 pr-3 py-2 border border-[#0f172a]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-[#0f172a] placeholder:text-[#0f172a]/50 bg-white"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[#0f172a]">
                            Пароль
                        </label>
                        <div className="relative">
                            <HiLockClosed className="absolute left-3 top-3 text-[#0f172a]/70" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-10 pr-10 py-2 border border-[#0f172a]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-[#0f172a] placeholder:text-[#0f172a]/50 bg-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <HiEyeOff className="h-5 w-5 text-[#0f172a]/70" />
                                ) : (
                                    <HiEye className="h-5 w-5 text-[#0f172a]/70" />
                                )}
                                <span className="sr-only">
                                    {showPassword ? "Скрыть пароль" : "Показать пароль"}
                                </span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded-lg text-white bg-[#0f172a] hover:bg-[#0f172a]/90 focus:outline-none transition ${
                            isLoading ? "opacity-70" : "opacity-100"
                        }`}
                    >
                        {isLoading ? "Вход" : "Войти"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#0f172a]">
                    Нет аккаунта?{" "}
                    <Link href="/register" className="text-[#0f172a] hover:underline">
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </div>
    );
}
