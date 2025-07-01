// src/app/profile/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Layout from '@/src/app/components/Layout';
import StatCard from '@/src/app/components/StatCard';
import { Card, Section } from '@/src/app/components/ProfileHelpers';
import {
    RiThumbUpLine,
    RiThumbDownLine,
    RiUpload2Line,
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
    neutral:  { label: 'Нейтральный',   bg: 'bg-gray-100',  text: 'text-gray-700'  },
    negative: { label: 'Отрицательный', bg: 'bg-red-100',   text: 'text-red-700'   },
};

const emotionConfig = {
    joy:        { label: 'Радость',       bg: 'bg-amber-100',  text: 'text-amber-700'  },
    interest:   { label: 'Интерес',       bg: 'bg-indigo-100', text: 'text-indigo-700' },
    surprise:   { label: 'Удивление',     bg: 'bg-amber-100',  text: 'text-amber-700'  },
    sadness:    { label: 'Грусть',        bg: 'bg-blue-100',   text: 'text-blue-700'   },
    anger:      { label: 'Злость',        bg: 'bg-red-100',    text: 'text-red-700'    },
    disgust:    { label: 'Отвращение',    bg: 'bg-lime-100',   text: 'text-lime-700'   },
    fear:       { label: 'Страх',         bg: 'bg-blue-100',   text: 'text-blue-700'   },
    guilt:      { label: 'Вина',          bg: 'bg-indigo-100', text: 'text-indigo-700' },
    neutral: { label: 'Нейтральность', bg: 'bg-gray-100',  text: 'text-gray-700'   },
};

export default function ProfilePage() {
    const router = useRouter();
    const take   = 12;

    const [userChecked, setUserChecked] = useState(false);
    const [profile,    setProfile]      = useState(null);
    const [lists,      setLists]        = useState({
        reviews:   { page:1, data:[], end:false },
        comments:  { page:1, data:[], end:false },
        questions: { page:1, data:[], end:false },
        answers:   { page:1, data:[], end:false },
    });
    const [loading,    setLoading]      = useState(true);
    const [error,      setError]        = useState('');

    // Проверяем аутентификацию
    useEffect(() => {
        fetchWithAutoRefresh('/api/auth/me')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(() => setUserChecked(true))
            .catch(() => router.push('/login'));
    }, [router]);

    // сли аутентификация пройдена — грузим профиль + списки
    useEffect(() => {
        if (!userChecked) return;

        (async () => {
            try {
                const first = await fetchWithAutoRefresh(`/api/profile?page=1&take=${take}`)
                    .then(r => r.json());
                setProfile(first.profile);
                setLists({
                    reviews:   { page:1, data:first.reviews,   end:first.reviews.length   < take },
                    comments:  { page:1, data:first.comments,  end:first.comments.length  < take },
                    questions: { page:1, data:first.questions, end:first.questions.length < take },
                    answers:   { page:1, data:first.answers,   end:first.answers.length   < take },
                });
            } catch {
                setError('Не удалось загрузить профиль');
            } finally {
                setLoading(false);
            }
        })();
    }, [userChecked]);

    const merge = (prev, arr, page) => {
        const seen   = new Set(prev.data.map(i => i.id));
        const unique = arr.filter(i => !seen.has(i.id));
        return { page, data:[...prev.data, ...unique], end: arr.length < take };
    };

    const more = key => async () => {
        const next = lists[key].page + 1;
        const j    = await fetchWithAutoRefresh(`/api/profile?page=${next}&take=${take}`)
            .then(r => r.json());
        setLists(prev => ({ ...prev, [key]: merge(prev[key], j[key], next) }));
    };

    const changeAvatar = async e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('avatar', file);
        const res = await fetchWithAutoRefresh('/api/profile', { method: 'POST', body: fd });

        if (res.ok) {
            const { avatar_url } = await res.json();
            setProfile(p => ({ ...p, avatar_url }));
        }
    };

    if (!userChecked || loading) {
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
                <div className="relative">
                    {profile.avatar_url ? (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#0f172a]/30">
                            <Image
                                src={profile.avatar_url}
                                alt={profile.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="h-24 w-24 flex items-center justify-center rounded-full bg-[#0f172a]/10
                            text-4xl text-[#0f172a] ring-2 ring-[#0f172a]/30">
                            {profile.name[0].toUpperCase()}
                        </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer">
                        <RiUpload2Line className="text-[#0f172a]" size={20}/>
                        <input type="file" accept="image/*" onChange={changeAvatar} className="hidden"/>
                    </label>
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-[#0f172a]">{profile.name}</h1>
                    <p className="text-lg text-[#0f172a]/80">
                        {profile.first_name} {profile.last_name}
                    </p>
                    <p className="text-[#0f172a]/70">{profile.email}</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard title="Отзывы" value={lists.reviews.data.length}/>
                    <StatCard title="Комментарии" value={lists.comments.data.length}/>
                    <StatCard title="Вопросы" value={lists.questions.data.length}/>
                    <StatCard title="Ответы" value={lists.answers.data.length}/>
                </div>
            </header>

            {/* SECTIONS */}
            <div className="space-y-12">
                {['reviews', 'comments', 'questions', 'answers'].map((type) => {
                    const titles = {
                        reviews: 'Отзывы',
                        comments: 'Комментарии',
                        questions: 'Вопросы',
                        answers: 'Ответы'
                    }
                    return (
                        <Section
                            key={type}
                            title={`${titles[type]} (${lists[type].data.length})`}
                            items={lists[type].data}
                            hasMore={!lists[type].end}
                            onMore={more(type)}
                            searchKey="text"
                            render={(item) => (
                                <Card key={item.id} className="flex flex-col h-full">
                                    <p className="text-[#0f172a] line-clamp-3 mb-4">{item.text}</p>
                                    <div className="flex flex-col">
                                        {type === 'reviews' && item.sentiment && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className={`${sentimentConfig[item.sentiment].bg} ${sentimentConfig[item.sentiment].text} rounded-full px-2 py-0.5 text-xs`}>
                                                    {sentimentConfig[item.sentiment].label}
                                                </span>
                                                {item.emotion && (
                                                    <span className={`${emotionConfig[item.emotion]?.bg || 'bg-[#0f172a]/10'} ${emotionConfig[item.emotion]?.text || 'text-[#0f172a]'} rounded-full px-2 py-0.5 text-xs`}>
                                                        {emotionConfig[item.emotion]?.label || item.emotion}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-auto flex flex-wrap items-center justify-between text-sm text-[#0f172a]/70 pt-4 border-t border-[#0f172a]/10 gap-2">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center text-sky-400">
                                                    <RiThumbUpLine className="mr-1" />
                                                    {item.likes || 0}
                                                </div>
                                                <div className="flex items-center text-red-400">
                                                    <RiThumbDownLine className="mr-1" />
                                                    {item.dislikes || 0}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                {type === 'questions' && (
                                                    <div className="flex items-center">
                                                        <RiChat1Line className="mr-1" />
                                                        {lists.answers.data.filter(a => a.question_id === item.id).length}
                                                    </div>
                                                )}
                                                {type === 'reviews' && (
                                                    <div className="flex items-center space-x-1">
                                                        {[...Array(item.rating)].map((_, i) => (
                                                            <RiStarFill key={i} className="text-yellow-500" />
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
                    )
                })}
            </div>
        </Layout>
    );
}


