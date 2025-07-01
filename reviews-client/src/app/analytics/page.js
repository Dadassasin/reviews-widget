// src/app/analytics/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Layout from "@/src/app/components/Layout";
import StatCard from "@/src/app/components/StatCard";
import { fetchWithAutoRefresh } from "@/src/app/libs/fetch";
import {RiInboxLine, RiLineChartLine} from "react-icons/ri";

function Loader() {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/60 backdrop-blur-sm">
            <div className="flex flex-col items-center">
                <div className="animate-spin h-12 w-12 border-4 border-t-[#0f172a] border-gray-200 rounded-full"></div>
                <p className="mt-2 text-[#0f172a]/70">Загрузка…</p>
            </div>
        </div>
    );
}

const sentimentConfig = [
    { key: "positive", label: "Положительные", chart: "#22c55e" },
    { key: "neutral",  label: "Нейтральные",   chart: "#6b7280" },
    { key: "negative", label: "Отрицательные", chart: "#ef4444" },
];

const emotionConfig = [
    { key: "joy",        label: "Радость",       chart: "#f59e0b" },
    { key: "interest",   label: "Интерес",       chart: "#6366f1" },
    { key: "surprise",   label: "Удивление",     chart: "#f59e0b" },
    { key: "sadness",    label: "Грусть",        chart: "#3b82f6" },
    { key: "anger",      label: "Злость",        chart: "#ef4444" },
    { key: "disgust",    label: "Отвращение",    chart: "#65a30d" },
    { key: "fear",       label: "Страх",         chart: "#1d4ed8" },
    { key: "guilt",      label: "Вина",          chart: "#6366f1" },
    { key: "neutrality", label: "Нейтральность", chart: "#6b7280" },
];

export default function AnalyticsPage() {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);
    const [widgets, setWidgets] = useState([]);
    const [widgetId, setWidgetId] = useState("all");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchWithAutoRefresh("/api/auth/me")
            .then((r) => r.ok ? r.json() : Promise.reject())
            .then(() => setAuthChecked(true))
            .catch(() => router.push("/login"));
    }, [router]);

    const reload = async (e) => {
        e?.preventDefault();
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            if (widgetId !== "all") params.append("widgetKey", widgetId);
            if (from) params.append("from", from);
            if (to) params.append("to", to);

            const res = await fetchWithAutoRefresh("/api/analytics?" + params.toString());
            if (!res.ok) throw new Error();
            const json = await res.json();
            const enriched = json.widgets.map((w, i) => ({
                ...w,
                seq: i + 1
            }));
            setWidgets(enriched);
            setStats(json.stats);
        } catch {
            setError("Не удалось загрузить аналитику");
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authChecked) reload();
    }, [authChecked]);

    // Показываем Loader, если проверка авторизации не закончена или идёт загрузка
    if (!authChecked || loading) {
        return (
            <Layout>
                <Loader />
            </Layout>
        );
    }

    // Основной рендер страницы
    return (
        <Layout>
            <h1 className="text-3xl font-semibold text-[#0f172a] mb-8">Аналитика</h1>

            <form onSubmit={reload} className="mb-10 flex flex-wrap items-end gap-4">
                {/* Фильтры */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium mb-1 text-[#0f172a]">Виджет</label>
                    <select
                        value={widgetId}
                        onChange={(e) => setWidgetId(e.target.value)}
                        className="w-full rounded-md border border-[#0f172a]/30 px-3 py-2 text-sm text-[#0f172a]
                       focus:outline-none focus:ring-2 focus:ring-[#0f172a] bg-white"
                    >
                        <option value="all">Все виджеты</option>
                        {widgets.map((w) => (
                            <option key={w.widget_key} value={w.widget_key}>
                                {w.title || `Widget #${w.seq}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-[#0f172a]">С</label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="rounded-md border border-[#0f172a]/30 px-3 py-2 text-sm text-[#0f172a]
                       focus:outline-none focus:ring-2 focus:ring-[#0f172a] bg-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-[#0f172a]">По</label>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="rounded-md border border-[#0f172a]/30 px-3 py-2 text-sm text-[#0f172a]
                       focus:outline-none focus:ring-2 focus:ring-[#0f172a] bg-white"
                    />
                </div>
                <button
                    type="submit"
                    className="h-10 rounded-md bg-[#0f172a] px-6 text-sm font-medium text-white
                     hover:bg-[#0f172a]/90 transition"
                >
                    Применить
                </button>
            </form>

            {error && <p className="text-center text-red-600 mb-6">{error}</p>}

            <div className="space-y-16">
                {/* Секция «Отзывы» */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-[#0f172a]">Отзывы</h2>
                    {stats?.reviews?.total > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                                <StatCard title="Всего отзывов" value={stats.reviews.total}/>
                                <StatCard title="Средняя оценка" value={stats.reviews.avgRating.toFixed(2)}/>
                                <StatCard
                                    title="Положительные %"
                                    value={`${
                                        ((stats.reviews.sentiments.positive || 0) / stats.reviews.total * 100).toFixed(1)
                                    }%`}
                                />
                                <StatCard
                                    title="Нейтральные %"
                                    value={`${
                                        ((stats.reviews.sentiments.neutral || 0) / stats.reviews.total * 100).toFixed(1)
                                    }%`}
                                />
                                <StatCard
                                    title="Негативные %"
                                    value={`${
                                        ((stats.reviews.sentiments.negative || 0) / stats.reviews.total * 100).toFixed(1)
                                    }%`}
                                />
                            </div>
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Сентимент */}
                                <div className="lg:basis-1/3 rounded-lg border border-[#0f172a]/30 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 text-lg font-medium text-[#0f172a]">Сентимент</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={sentimentConfig.map(s => ({
                                            name: s.label,
                                            value: stats.reviews.sentiments[s.key] || 0,
                                            key: s.key
                                        }))}>
                                            <XAxis dataKey="name" tick={{fill: "#4B5563", fontSize: 12}}/>
                                            <YAxis allowDecimals={false} tick={{fill: "#4B5563", fontSize: 12}}/>
                                            <Tooltip contentStyle={{borderRadius: 4, borderColor: "#0f172a"}}/>
                                            {sentimentConfig.map(s => (
                                                <Bar
                                                    key={s.key}
                                                    dataKey={d => d.key === s.key ? d.value : 0}
                                                    stackId="a"
                                                    fill={s.chart}
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            ))}
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Эмоции */}
                                <div className="lg:basis-2/3 rounded-lg border border-[#0f172a]/30 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 text-lg font-medium text-[#0f172a]">Эмоции</h3>
                                    {emotionConfig
                                        .map(e => ({ name: e.label, value: stats.reviews.emotions[e.key] || 0, key: e.key }))
                                        .filter(d => d.value > 0).length > 0 ? (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    dataKey="value"
                                                    data={emotionConfig
                                                        .map(e => ({ name: e.label, value: stats.reviews.emotions[e.key] || 0, key: e.key }))
                                                        .filter(d => d.value > 0)}
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={4}
                                                    labelLine={false}
                                                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {emotionConfig.map(e => (
                                                        <Cell key={e.key} fill={e.chart}/>
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={val => `${val} шт.`}
                                                         contentStyle={{borderRadius: 4, borderColor: "#0f172a"}}/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="text-center text-[#0f172a]/70">Нет данных по эмоциям</p>
                                    )}
                                </div>
                            </div>
                            {/* Таблица распределения оценок */}
                            <div className="rounded-lg border border-[#0f172a]/30 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-medium text-[#0f172a]">Оценки (1–5)</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-[#0f172a]/10 text-[#0f172a]">
                                        <tr>
                                            <th className="px-4 py-2 font-medium">Оценка</th>
                                            <th className="px-4 py-2 font-medium">Количество</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        {[5,4,3,2,1].map(r => (
                                            <tr key={r} className="hover:bg-[#0f172a]/5 transition">
                                                <td className="px-4 py-2 text-[#0f172a]">{r}</td>
                                                <td className="px-4 py-2 text-[#0f172a]">
                                                    {stats.reviews.ratings?.[r] || 0}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div
                            className="flex flex-col items-center py-10 text-[#0f172a]/60 border rounded-md border-[#0f172a]/20 border-dashed">
                            <RiLineChartLine className="text-3xl mb-3"/>
                            <h3 className="text-base font-medium">Данных не найдено</h3>
                        </div>
                    )}
                </section>

                {/* Секция «Вопросы и ответы» */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-[#0f172a]">Вопросы и ответы</h2>
                    {stats?.questions?.total > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard title="Всего вопросов" value={stats.questions.total}/>
                                <StatCard title="Отвечено" value={stats.questions.total - stats.questions.unanswered}/>
                                <StatCard title="Без ответа" value={stats.questions.unanswered}/>
                                <StatCard
                                    title="Процент ответов"
                                    value={`${((stats.questions.total - stats.questions.unanswered) / stats.questions.total * 100).toFixed(1)}%`}
                                />
                            </div>
                            <div className="rounded-lg border border-[#0f172a]/30 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-medium text-[#0f172a]">Статус вопросов</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            dataKey="value"
                                            data={[
                                                { name: "Отвеченные", value: stats.questions.total - stats.questions.unanswered },
                                                { name: "Неотвеченные", value: stats.questions.unanswered }
                                            ]}
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            <Cell fill="#22c55e" />
                                            <Cell fill="#ef4444" />
                                        </Pie>
                                        <Tooltip formatter={val => `${val} шт.`} contentStyle={{ borderRadius: 4, borderColor: "#0f172a" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    ) : (
                        <div
                            className="flex flex-col items-center py-10 text-[#0f172a]/60 border rounded-md border-[#0f172a]/20 border-dashed">
                            <RiLineChartLine className="text-3xl mb-3"/>
                            <h3 className="text-base font-medium">Данных не найдено</h3>
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
}
