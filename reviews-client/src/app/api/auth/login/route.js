// src/app/api/auth/login/route.js
import { NextResponse }       from 'next/server';
import User                   from '@/models/User.js';
import RefreshToken           from '@/models/RefreshToken.js';
import { verifyPassword, signJwt } from '@/src/app/libs/auth.js';

export async function POST(req) {
    const { email, password } = await req.json();
    if (!email || !password) {
        return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }
    const user = await User.query().findOne({ email });
    if (!user || !(await verifyPassword(password, user.password))) {
        return NextResponse.json({ error: 'Неверные учётные данные' }, { status: 401 });
    }

    const accessToken = signJwt({ id: user.id });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const rt = await RefreshToken.query().insertAndFetch({
        user_id:   Number(user.id),
        expires_at: expiresAt.toISOString(),
    });
    const refreshToken = rt.token;

    const res = NextResponse.json({ user: user.$formatJson(user) });

    res.cookies.set(
        'token',
        accessToken,
        { httpOnly:true, path:'/', maxAge:15*60, sameSite:'lax', secure:false }
    );
    res.cookies.set(
        'refreshToken',
        refreshToken,
        { httpOnly:true, path:'/', maxAge:7*24*60*60, sameSite:'lax', secure:false }
    );

    return res;
}
