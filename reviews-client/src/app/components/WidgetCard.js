// src/app/components/WidgetCard.js
"use client";

import { useState, useRef, useEffect } from "react";
import {
    RiDeleteBinLine,
    RiFileCopyFill,
    RiCheckboxBlankLine,
    RiCheckboxFill,
} from "react-icons/ri";

export default function WidgetCard({ widget, onDelete, onUpdate }) {
    // Текущее заголовок
    const defaultTitle = widget.title || `Widget #${widget.seq || widget.id}`;
    const [title, setTitle] = useState(defaultTitle);

    // Режим редактирования заголовка
    const [editing, setEditing] = useState(false);
    const [savingTitle, setSavingTitle] = useState(false);
    const inputRef = useRef(null);

    // Скопировано сниппет?
    const [copied, setCopied] = useState(false);

    // Анонимные отзывы
    const [allowAnon, setAllowAnon] = useState(
        Boolean(widget.config?.allowAnonymous)
    );
    const [savingConfig, setSavingConfig] = useState(false);

    const snippet = `<script type="module" src="http://localhost:3000/widgets/reviews-widget.js"></script>
<reviews-widget widget-id="${widget.widget_key}"></reviews-widget>`;

    // Копирование сниппета
    const copy = () => {
        navigator.clipboard.writeText(snippet).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    // Переключить анонимность
    async function toggleAnon() {
        const next = !allowAnon;
        setAllowAnon(next);
        setSavingConfig(true);
        try {
            const res = await fetch(
                `/api/widgets/${widget.widget_key}/config`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ allowAnonymous: next }),
                }
            );
            if (!res.ok) throw new Error();
            const { widget: updated } = await res.json();
            onUpdate?.(updated);
        } catch {
            setAllowAnon(!next);
            alert("Не удалось сохранить настройку");
        } finally {
            setSavingConfig(false);
        }
    }

    // Сохранить новый заголовок
    async function saveTitle() {
        const trimmed = title.trim();
        if (!trimmed) {
            // Не даём пустое имя
            setTitle(defaultTitle);
            setEditing(false);
            return;
        }
        if (trimmed === defaultTitle) {
            setEditing(false);
            return;
        }
        setSavingTitle(true);
        try {
            const res = await fetch(
                `/api/widgets/${widget.widget_key}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: trimmed }),
                }
            );
            if (!res.ok) throw new Error();
            const { widget: updated } = await res.json();
            onUpdate?.(updated);
        } catch {
            alert("Не удалось сохранить название");
            setTitle(defaultTitle);
        } finally {
            setSavingTitle(false);
            setEditing(false);
        }
    }

    // Фокусируем input при входе в режим редактирования
    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editing]);

    return (
        <div className="relative rounded-xl bg-white p-5 shadow transition hover:shadow-md">
            <button
                className="absolute right-4 top-5 text-red-500 transition hover:text-red-700"
                title="Удалить виджет"
                onClick={() => onDelete(widget.id)}
            >
                <RiDeleteBinLine size={18} />
            </button>

            <div className="mb-1">
                {editing ? (
                    <input
                        ref={inputRef}
                        className="w-full bg-transparent text-lg font-semibold text-[#0f172a] focus:outline-none"
                        value={title}
                        disabled={savingTitle}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                saveTitle();
                            } else if (e.key === "Escape") {
                                setTitle(defaultTitle);
                                setEditing(false);
                            }
                        }}
                    />
                ) : (
                    <h2
                        className="cursor-text text-lg font-semibold text-[#0f172a]"
                        onClick={() => setEditing(true)}
                    >
                        {title}
                    </h2>
                )}
            </div>

            <p className="mb-4 text-sm text-[#0f172a]/70 break-all">
                key: <span className="select-all">{widget.widget_key}</span>
            </p>

            <div className="mb-4 flex items-center gap-2 text-sm">
                <button
                    onClick={toggleAnon}
                    disabled={savingConfig}
                    className="flex w-full items-center gap-1 rounded border border-[#0f172a]/30 px-2 py-1 hover:bg-[#0f172a]/5 disabled:cursor-not-allowed"
                >
                    {allowAnon ? (
                        <>
                            <RiCheckboxFill className="text-[#0f172a]" />
                            <span>Анонимные отзывы включены</span>
                        </>
                    ) : (
                        <>
                            <RiCheckboxBlankLine className="text-[#0f172a]/50" />
                            <span>Анонимные отзывы выключены</span>
                        </>
                    )}
                </button>
            </div>

            <pre className="relative whitespace-pre-wrap rounded bg-[#f5f5f5] p-2 text-xs break-all text-[#0f172a]/70">
            {snippet}
                <button
                    onClick={copy}
                    title="Скопировать"
                    className="absolute right-2 top-2 text-[#0f172a]/70 hover:text-[#0f172a]"
                >
                    <RiFileCopyFill size={16} />
                </button>
            </pre>

            {copied && (
                <span className="mt-2 block text-center text-xs text-[#0f172a]">
                    Скопировано!
                </span>
            )}
        </div>
    );
}
