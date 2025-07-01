// app/api/auth/refresh/route.js
import { NextResponse }    from 'next/server';
import { signJwt }         from '@/src/app/libs/auth.js';
import RefreshToken        from '@/models/RefreshToken.js';
import User                from '@/models/User.js';
import { cookies }         from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();
    const rtValue = cookieStore.get('refreshToken')?.value;
    if (!rtValue) {
        return NextResponse.json({ error: 'Unauth' }, { status: 401 });
    }

    // Находим запись
    const record = await RefreshToken.query()
        .findOne({ token: rtValue, revoked: false })
        .where('expires_at', '>', new Date());

    if (!record) {
        return NextResponse.json({ error: 'Unauth' }, { status: 401 });
    }

    // Генерируем новый access
    const user = await User.query().findById(record.user_id);
    if (!user) return NextResponse.json({ error: 'Unauth' }, { status: 401 });

    const newAccess = signJwt({ id: user.id });
    const res = NextResponse.json({ success: true });
    res.cookies.set('token', newAccess, {
        httpOnly: true,
        path:     '/',
        maxAge:   15 * 60,        // 15 минут
        sameSite: 'lax',
        secure:   process.env.NODE_ENV === 'production',
    });
    return res;
}
