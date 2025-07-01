// src/app/components/ProfileHelpers.js
'use client';

import { useState } from 'react';
import { RiSearchLine, RiInboxLine } from 'react-icons/ri';

export function Card({ children }) {
    return (
        <div className="flex flex-col justify-between group relative overflow-hidden rounded-xl bg-white p-6 shadow hover:shadow-lg transition-shadow">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            {children}
        </div>
    );
}

export function Section({ title, items, onMore, hasMore, render, searchKey }) {
    const [query, setQuery] = useState('');
    const filtered = items.filter(item =>
        item[searchKey]?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-semibold text-[#0f172a]">{title}</h2>
                <div className="relative w-full sm:w-64">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0f172a]/50" />
                    <input
                        type="text"
                        placeholder="Поиск..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#0f172a]/30 rounded-lg bg-white text-sm text-[#0f172a]
                       placeholder-[#0f172a]/50 focus:outline-none focus:ring-2 focus:ring-[#0f172a] transition"
                    />
                </div>
            </div>
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-4 text-[#0f172a]/60 border rounded-md border-[#0f172a]/20 border-dashed">
                    <RiInboxLine className="text-3xl mb-3" />
                    <h3 className="text-base font-medium">Ничего не найдено</h3>
                    <p className="mt-1 text-xs">Попробуйте изменить запрос</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map(render)}
                </div>
            )}
            {hasMore && filtered.length > 0 && (
                <div className="text-center">
                    <button
                        onClick={onMore}
                        className="inline-block rounded-md bg-[#0f172a] px-5 py-2 text-sm font-medium text-white hover:bg-[#0f172a]/90 transition"
                    >
                        Показать ещё
                    </button>
                </div>
            )}
        </section>
    );
}
