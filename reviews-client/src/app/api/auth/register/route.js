// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import User             from '@/models/User.js';
import RefreshToken     from '@/models/RefreshToken.js';
import { hashPassword, signJwt } from '@/src/app/libs/auth.js';

export async function POST(req) {
    const { name, firstName, lastName, email, password } = await req.json();

    // Проверяем обязательные поля
    if (!name || !firstName || !lastName || !email || !password) {
        return NextResponse.json(
            { error: 'Никнейм, имя, фамилия, email и пароль — все поля обязательны' },
            { status: 400 }
        );
    }

    // Проверка на существующего пользователя
    if (await User.query().findOne({ email })) {
        return NextResponse.json(
            { error: 'Пользователь с таким email уже существует' },
            { status: 409 }
        );
    }

    // Проверяем уникальность никнейма
    if (await User.query().findOne({ name })) {
        return NextResponse.json(
            { error: 'Никнейм уже занят' },
            { status: 409 }
        );
    }

    // Создаём пользователя
    const user = await User.query().insert({
        name,
        first_name: firstName,
        last_name:  lastName,
        email,
        password:   await hashPassword(password),
    });

    // Генерируем access-токен
    const accessToken = signJwt({ id: user.id });

    // Создаём запись refresh-токена в БД
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const rt = await RefreshToken.query().insertAndFetch({
        user_id:    Number(user.id),
        expires_at: expiresAt.toISOString(),
    });
    const refreshToken = rt.token;

    // Формируем ответ
    const res = NextResponse.json({ user: user.$formatJson(user) });

    // Устанавливаем access-куку
    res.cookies.set('token', accessToken, {
        httpOnly: true,
        path:     '/',
        maxAge:   15 * 60,       // 15 минут
        sameSite: 'lax',
        secure:   process.env.NODE_ENV === 'production',
    });

    // Устанавливаем refresh-куку
    res.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        path:     '/',
        maxAge:   7 * 24 * 60 * 60,  // 7 дней
        sameSite: 'lax',
        secure:   process.env.NODE_ENV === 'production',
    });

    return res;
}
