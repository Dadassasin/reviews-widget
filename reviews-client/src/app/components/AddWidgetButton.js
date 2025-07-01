// src/app/components/AddWidgetButton.js
"use client";

import { useState } from "react";
import {fetchWithAutoRefresh} from "@/src/app/libs/fetch";

export default function AddWidgetButton({ onAdd }) {
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetchWithAutoRefresh("/api/widgets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ config: {} }),
            });
            if (!res.ok) throw new Error();
            const { widget } = await res.json();
            onAdd(widget);
        } catch {
            alert("Не удалось добавить виджет");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleAdd}
            disabled={loading}
            className={`px-4 py-2 rounded transition ${
                loading
                    ? "bg-[#0f172a]/30 cursor-not-allowed text-[#0f172a]/50"
                    : "bg-[#0f172a] text-white hover:bg-[#0f172a]/90"
            }`}
        >
            {loading ? "Создание…" : "+ Добавить виджет"}
        </button>
    );
}
