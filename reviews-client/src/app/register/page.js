// src/app/register/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiUser,
    HiMail,
    HiLockClosed,
    HiEye,
    HiEyeOff
} from "react-icons/hi";
import { fetchWithAutoRefresh } from "@/src/app/libs/fetch";

export default function RegisterPage() {
    const router = useRouter();
    // undefined — ещё проверяем; null — неавторизован; object — уже залогинен
    const [user, setUser] = useState(undefined);

    const [nickname, setNickname]             = useState("");
    const [firstName, setFirstName]           = useState("");
    const [lastName, setLastName]             = useState("");
    const [email, setEmail]                   = useState("");
    const [password, setPassword]             = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword]     = useState(false);
    const [showConfirm, setShowConfirm]       = useState(false);
    const [isLoading, setIsLoading]           = useState(false);
    const [errors, setErrors]                 = useState({
        nickname: "", firstName: "", lastName: "",
        email: "", password: "", confirm: "", api: ""
    });

    // Проверяем текущего пользователя
    useEffect(() => {
        fetchWithAutoRefresh("/api/auth/me", { credentials: "include" })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                const u = data?.user ?? null;
                setUser(u);
                if (u) {
                    router.replace("/dashboard");
                }
            })
            .catch(() => setUser(null));
    }, [router]);

    // Пока статус авторизации не известен или пользователь залогинен — не рендерим форму
    if (user === undefined || user) {
        return null;
    }

    function validate() {
        const errs = { nickname: "", firstName: "", lastName: "", email: "", password: "", confirm: "" };

        if (nickname.trim().length < 2)    errs.nickname  = "Не менее 2 символов";
        if (firstName.trim().length < 2)   errs.firstName = "Не менее 2 символов";
        if (lastName.trim().length < 2)    errs.lastName  = "Не менее 2 символов";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Неверный email";
        if (password.length < 6)           errs.password  = "Не менее 6 символов";
        if (confirmPassword !== password)  errs.confirm   = "Пароли не совпадают";

        setErrors(prev => ({ ...prev, ...errs }));
        return !Object.values(errs).some(Boolean);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setErrors({ nickname: "", firstName: "", lastName: "", email: "", password: "", confirm: "", api: "" });

        if (!validate()) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method:      "POST",
                headers:     { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: nickname,
                    firstName,
                    lastName,
                    email,
                    password
                })
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 409) {
                    const msg = data.error.toLowerCase();
                    if (msg.includes("email")) {
                        setErrors(prev => ({ ...prev, email: data.error }));
                    } else {
                        setErrors(prev => ({ ...prev, nickname: data.error }));
                    }
                } else {
                    setErrors(prev => ({ ...prev, api: data.error }));
                }
                setIsLoading(false);
                return;
            }
            router.push("/dashboard");
        } catch {
            setErrors(prev => ({ ...prev, api: "Сетевая ошибка" }));
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center bg-[#0f172a]/10 rounded-full h-12 w-12 mb-2">
                        <HiUser className="text-[#0f172a] h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#0f172a]">Создать аккаунт</h1>
                    <p className="text-[#0f172a]">Введите данные для регистрации</p>
                </div>

                {errors.api && <p className="text-red-500 text-center mb-4">{errors.api}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Никнейм */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-[#0f172a]">Никнейм</label>
                        <div className="relative">
                            <HiUser className="absolute left-3 top-3 text-[#0f172a]/70" />
                            <input
                                type="text"
                                value={nickname}
                                onChange={e => setNickname(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2 border border-[#0f172a]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-[#0f172a] bg-white"
                                placeholder="никнейм"
                            />
                        </div>
                        {errors.nickname && <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>}
                    </div>

                    {/* Имя и фамилия */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[#0f172a]">Имя</label>
                            <div className="relative">
                                <HiUser className="absolute left-3 top-3 text-[#0f172a]/70" />
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-[#0f172a]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-[#0f172a] bg-white"
                                    placeholder="имя"
                                />
                            </div>
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[#0f172a]">Фамилия</label>
                            <div className="relative">
                                <HiUser className="absolute left-3 top-3 text-[#0f172a]/70" />
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-[#0f172a]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-[#0f172a] bg-white"
                                    placeholder="фамилия"
                                />
                            </div>
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-[#0f172a]">Электронная почта</label>
                        <div className="relative">
                            <HiMail className="absolute left-3 top-3 text-[#0f172a]/70" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2 border border-[#0f172a]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-[#0f172a] bg-white"
                                placeholder="email@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Пароль */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-[#0f172a]">Пароль</label>
                        <div className="relative">
                            <HiLockClosed className="absolute left-3 top-3 text-[#0f172a]/70" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-10 py-2 border border-[#0f172a]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-[#0f172a] bg-white"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword
                                    ? <HiEyeOff className="h-5 w-5 text-[#0f172a]/70" />
                                    : <HiEye    className="h-5 w-5 text-[#0f172a]/70" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Подтверждение пароля */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-[#0f172a]">Подтвердите пароль</label>
                        <div className="relative">
                            <HiLockClosed className="absolute left-3 top-3 text-[#0f172a]/70" />
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-10 py-2 border border-[#0f172a]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-[#0f172a] bg-white"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 focus:outline-none"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm
                                    ? <HiEyeOff className="h-5 w-5 text-[#0f172a]/70" />
                                    : <HiEye    className="h-5 w-5 text-[#0f172a]/70" />}
                            </button>
                        </div>
                        {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded-2xl text-white bg-[#0f172a] hover:bg-[#0f172a]/90 transition ${isLoading?"opacity-70":"opacity-100"}`}
                    >
                        {isLoading ? "Регистрация" : "Зарегистрироваться"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#0f172a]">
                    Уже есть аккаунт?{" "}
                    <Link href="/login" className="text-[#0f172a] hover:underline">
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
}
