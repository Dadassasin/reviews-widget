// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import RefreshToken     from '@/models/RefreshToken.js';
import { cookies }      from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();
    const rtValue = cookieStore.get('refreshToken')?.value;

    if (rtValue) {
        await RefreshToken.query()
            .findOne({ token: rtValue })
            .patch({ revoked: true });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set('token', '', { httpOnly:true, path:'/', expires: new Date(0) });
    res.cookies.set('refreshToken', '', { httpOnly:true, path:'/', expires: new Date(0) });
    return res;
}
