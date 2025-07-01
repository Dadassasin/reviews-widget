// src/app/users/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Layout from '@/src/app/components/Layout';
import StatCard from '@/src/app/components/StatCard';
import { Card, Section } from '@/src/app/components/ProfileHelpers';
import {
    RiThumbUpLine,
    RiThumbDownLine,
    RiStarFill,
    RiChat1Line,
} from 'react-icons/ri';
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

const sentimentConfig = {
    positive: { label: 'Положительный', bg: 'bg-green-100', text: 'text-green-700' },
    neutral:  { label: 'Нейтральный',  bg: 'bg-gray-100',  text: 'text-gray-700' },
    negative: { label: 'Отрицательный', bg: 'bg-red-100',   text: 'text-red-700' },
};

const emotionConfig = {
    joy:      { label: 'Радость',       bg: 'bg-amber-100',  text: 'text-amber-700' },
    interest: { label: 'Интерес',       bg: 'bg-indigo-100', text: 'text-indigo-700' },
    surprise: { label: 'Удивление',     bg: 'bg-amber-100',  text: 'text-amber-700' },
    sadness:  { label: 'Грусть',        bg: 'bg-blue-100',   text: 'text-blue-700' },
    anger:    { label: 'Злость',        bg: 'bg-red-100',    text: 'text-red-700' },
    disgust:  { label: 'Отвращение',    bg: 'bg-lime-100',   text: 'text-lime-700' },
    fear:     { label: 'Страх',         bg: 'bg-blue-100',   text: 'text-blue-700' },
    guilt:    { label: 'Вина',          bg: 'bg-indigo-100', text: 'text-indigo-700' },
    neutral:  { label: 'Нейтральность', bg: 'bg-gray-100',   text: 'text-gray-700' },
};

export default function UserProfilePage() {
    const router = useRouter();
    const { id } = useParams();
    const take = 12;

    const [authUser, setAuthUser] = useState(undefined);
    const [profile, setProfile] = useState(null);
    const [lists, setLists]     = useState({
        reviews:   { page: 1, data: [], end: false },
        comments:  { page: 1, data: [], end: false },
        questions: { page: 1, data: [], end: false },
        answers:   { page: 1, data: [], end: false },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');

    useEffect(() => {
        fetchWithAutoRefresh('/api/auth/me', { credentials: 'include' })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                const u = data?.user ?? null;
                setAuthUser(u);
                if (u && String(u.id) === id) {
                    router.replace('/profile');
                }
            })
            .catch(() => setAuthUser(null));
    }, [id, router]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/users/${id}?page=1&take=${take}`);
                if (res.status === 404) {
                    setError('Пользователь не найден');
                    return;
                }
                if (!res.ok) {
                    setError('Ошибка при загрузке профиля');
                    return;
                }
                const json = await res.json();
                setProfile(json.profile);
                setLists({
                    reviews:   { page:1, data: json.reviews,   end: json.reviews.length   < take },
                    comments:  { page:1, data: json.comments,  end: json.comments.length  < take },
                    questions: { page:1, data: json.questions, end: json.questions.length < take },
                    answers:   { page:1, data: json.answers,   end: json.answers.length   < take },
                });
            } catch {
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const merge = (prev, arr, page) => {
        const seen   = new Set(prev.data.map(i => i.id));
        const unique = arr.filter(i => !seen.has(i.id));
        return { page, data: [...prev.data, ...unique], end: arr.length < take };
    };

    const more = key => async () => {
        const next = lists[key].page + 1;
        const res  = await fetch(`/api/users/${id}?page=${next}&take=${take}`);
        if (!res.ok) return;
        const json = await res.json();
        setLists(prev => ({
            ...prev,
            [key]: merge(prev[key], json[key], next),
        }));
    };

    // Пока не известен статус авторизации или идёт редирект ничего не рендерим
    if (authUser === undefined || (authUser && String(authUser.id) === id)) {
        return null;
    }
    if (loading) {
        return (
            <Layout>
                <Loader />
            </Layout>
        );
    }
    if (error || !profile) {
        return (
            <Layout>
                <p className="p-8 text-center text-red-600">{error || 'Ошибка'}</p>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* HEADER */}
            <header className="mb-12 flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#0f172a]/30">
                    {profile.avatar_url ? (
                        <Image
                            src={profile.avatar_url}
                            alt={profile.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#0f172a]/10 text-4xl text-[#0f172a]">
                            {profile.name[0].toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-[#0f172a]">{profile.name}</h1>
                    <p className="text-lg text-[#0f172a]/80">
                        {profile.first_name} {profile.last_name}
                    </p>
                    <p className="text-[#0f172a]/70">{profile.email}</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard title="Отзывы"     value={lists.reviews.data.length} />
                    <StatCard title="Комментарии" value={lists.comments.data.length} />
                    <StatCard title="Вопросы"     value={lists.questions.data.length} />
                    <StatCard title="Ответы"      value={lists.answers.data.length} />
                </div>
            </header>

            {/* SECTIONS */}
            <div className="space-y-12">
                {['reviews', 'comments', 'questions', 'answers'].map(type => {
                    const titles = {
                        reviews:   'Отзывы',
                        comments:  'Комментарии',
                        questions: 'Вопросы',
                        answers:   'Ответы',
                    };
                    return (
                        <Section
                            key={type}
                            title={`${titles[type]} (${lists[type].data.length})`}
                            items={lists[type].data}
                            hasMore={!lists[type].end}
                            onMore={more(type)}
                            searchKey="text"
                            render={item => (
                                <Card key={item.id} className="flex flex-col h-full">
                                    <p className="text-[#0f172a] line-clamp-3 mb-4">{item.text}</p>
                                    <div className="flex flex-col">
                                        {type === 'reviews' && item.sentiment && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                        <span
                                            className={`${sentimentConfig[item.sentiment].bg} ${sentimentConfig[item.sentiment].text} rounded-full px-2 py-0.5 text-xs`}>
                                            {sentimentConfig[item.sentiment].label}
                                        </span>
                                                {item.emotion && (
                                                    <span
                                                        className={`${emotionConfig[item.emotion]?.bg || 'bg-[#0f172a]/10'} ${emotionConfig[item.emotion]?.text || 'text-[#0f172a]'} rounded-full px-2 py-0.5 text-xs`}>
                                                    {emotionConfig[item.emotion]?.label || item.emotion}
                                                </span>
                                                )}
                                            </div>
                                        )}

                                        <div
                                            className="mt-auto flex flex-wrap items-center justify-between text-sm text-[#0f172a]/70 pt-4 border-t border-[#0f172a]/10 gap-2">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center text-sky-400">
                                                    <RiThumbUpLine className="mr-1"/>
                                                    {item.likes || 0}
                                                </div>
                                                <div className="flex items-center text-red-400">
                                                    <RiThumbDownLine className="mr-1"/>
                                                    {item.dislikes || 0}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                {type === 'questions' && (
                                                    <div className="flex items-center">
                                                        <RiChat1Line className="mr-1"/>
                                                        {lists.answers.data.filter(a => a.question_id === item.id).length}
                                                    </div>
                                                )}
                                                {type === 'reviews' && (
                                                    <div className="flex items-center space-x-1">
                                                        {[...Array(item.rating)].map((_, i) => (
                                                            <RiStarFill key={i} className="text-yellow-500"/>
                                                        ))}
                                                    </div>
                                                )}
                                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        />
                    );
                })}
            </div>
        </Layout>
    );
}
