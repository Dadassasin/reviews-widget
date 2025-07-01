// src/app/reports/page.js
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/src/app/components/Layout";
import { RiDeleteBinLine, RiCloseCircleLine } from 'react-icons/ri';
import { fetchWithAutoRefresh } from '@/src/app/libs/fetch';

function Loader() {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/75">
            <div className="flex flex-col items-center">
                <div className="animate-spin h-12 w-12 border-4 border-t-[#0f172a] border-gray-200 rounded-full"></div>
                <p className="mt-2 text-[#0f172a]/70">Загрузка…</p>
            </div>
        </div>
    );
}

const typeLabels = {
    review:   "Жалобы на отзывы",
    comment:  "Жалобы на комментарии",
    question: "Жалобы на вопросы",
    answer:   "Жалобы на ответы",
};

const reasonLabels = {
    spam:      "Спам/реклама",
    offensive: "Оскорбления",
    false:     "Ложная информация",
    other:     "Другое"
};

export default function ReportsPage() {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);
    const [data,        setData]        = useState(null);

    // Проверка аутентификации
    useEffect(() => {
        fetchWithAutoRefresh('/api/auth/me')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(() => setAuthChecked(true))
            .catch(() => router.push('/login'));
    }, [router]);

    // Загрузка жалоб
    useEffect(() => {
        if (!authChecked) return;
        fetchWithAutoRefresh("/api/reports")
            .then(r => {
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then(setData)
            .catch(() => {
                console.error('Не удалось загрузить жалобы');
            });
    }, [authChecked]);

    // Удалить объект и все его жалобы
    const deleteObject = async (type, objId) => {
        const res = await fetchWithAutoRefresh(
            `/api/delete/${type}s/${objId}`,
            { method: 'DELETE' }
        );
        if (!res.ok) {
            alert("Не удалось удалить объект");
            return;
        }
        setData(d => ({
            ...d,
            [`${type}Reports`]: d[`${type}Reports`].filter(r => r[`${type}_id`] !== objId)
        }));
    };

    // Отклонить жалобу
    const resolveReport = async (type, reportId) => {
        const res = await fetchWithAutoRefresh(
            `/api/reports/${type}/${reportId}/resolve`,
            { method: 'POST' }
        );
        if (!res.ok) {
            alert("Не удалось отклонить жалобу");
            return;
        }
        setData(d => ({
            ...d,
            [`${type}Reports`]: d[`${type}Reports`].filter(r => r.id !== reportId)
        }));
    };

    // Пока auth не проверен или data не загружен — Loader
    if (!authChecked || !data) {
        return (
            <Layout>
                <Loader />
            </Layout>
        );
    }

    const columns = [
        { label: "ID",           className: "w-1/12" },
        { label: "Пользователь", className: "w-2/12" },
        { label: "Причина",       className: "w-3/12" },
        { label: "Комментарий",   className: "w-4/12" },
        { label: "Действие",      className: "w-2/12" },
    ];

    return (
        <Layout>
            <div className="space-y-12">
                <h1 className="text-3xl font-semibold text-[#0f172a]">Жалобы</h1>

                {Object.keys(typeLabels).map(type => {
                    const reports = data[`${type}Reports`] || [];
                    return (
                        <section key={type} className="space-y-4">
                            <h2 className="text-2xl font-medium text-[#0f172a]">
                                {typeLabels[type]}
                            </h2>

                            <div className="overflow-x-auto bg-white rounded-lg shadow">
                                <table className="min-w-full table-fixed">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        {columns.map((col, i) => (
                                            <th
                                                key={i}
                                                className={`px-4 py-2 text-left text-sm font-medium text-gray-700 ${col.className}`}
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reports.map(r => (
                                        <tr key={r.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                            <td className="px-4 py-2 text-gray-800">{r.id}</td>
                                            <td className="px-4 py-2 text-gray-800">{r.user?.name || "Аноним"}</td>
                                            <td className="px-4 py-2 text-gray-800">{reasonLabels[r.reason]}</td>
                                            <td className="px-4 py-2 text-gray-800">{r.comment || "-"}</td>
                                            <td className="px-4 py-2 flex space-x-1">
                                                <button
                                                    onClick={() => deleteObject(type, r[`${type}_id`])}
                                                    className="flex items-center px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
                                                >
                                                    <RiDeleteBinLine className="w-4 h-4 mr-1"/> Удалить
                                                </button>
                                                <button
                                                    onClick={() => resolveReport(type, r.id)}
                                                    className="flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition"
                                                >
                                                    <RiCloseCircleLine className="w-4 h-4 mr-1"/> Отклонить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {reports.length === 0 && (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                                                Нет жалоб
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    );
                })}
            </div>
        </Layout>
    );
}
