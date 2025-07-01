// src/app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/src/app/components/Layout";
import AddWidgetButton from "../components/AddWidgetButton";
import WidgetCard from "../components/WidgetCard";
import {fetchWithAutoRefresh} from "@/src/app/libs/fetch";

function Loader() {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin h-12 w-12 border-4 border-t-[#0f172a] border-gray-200 rounded-full"></div>
                <p className="mt-2 text-[#0f172a]/70">Загрузка…</p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [widgets, setWidgets] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchWithAutoRefresh("/api/auth/me")
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then(({ user }) => setUser(user))
            .catch(() => router.push("/login"));
    }, [router]);

    useEffect(() => {
        if (!user) return;
        fetchWithAutoRefresh("/api/widgets")
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((d) => setWidgets(d.widgets))
            .catch(() => setError("Не удалось загрузить виджеты"));
    }, [user]);

    const handleDelete = async (id) => {
        if (!confirm("Удалить этот виджет?")) return;
        const res = await fetchWithAutoRefresh(`/api/widgets/${id}`, { method: "DELETE" });
        if (res.ok) setWidgets((ws) => ws.filter((w) => w.id !== id));
        else alert("Ошибка удаления виджета");
    };

    const handleUpdate = (updated) => {
        setWidgets((ws) =>
            ws.map((w) =>
                w.widget_key === updated.widget_key ? updated : w
            )
        );
    };

    if (!user) {
        return (
            <Layout>
                <Loader />
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Заголовок */}
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-[#0f172a]">
                    Мои виджеты
                </h1>
                <AddWidgetButton onAdd={(w) => setWidgets((ws) => [w, ...ws])} />
            </div>

            {/* Ошибка */}
            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* Контент */}
            {widgets.length === 0 ? (
                <div className="p-8 text-center text-[#0f172a]/70">
                    У вас ещё нет виджетов.
                    <br />
                    Нажмите «Добавить виджет».
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {widgets.map((w) => (
                        <WidgetCard
                            key={w.id}
                            widget={w}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </div>
            )}
        </Layout>
    );
}
