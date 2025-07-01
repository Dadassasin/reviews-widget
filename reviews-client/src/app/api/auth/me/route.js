// src/app/api/auth/me/route.js
import { cookies }    from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyJwt }  from '@/src/app/libs/auth.js';
import User           from '@/models/User.js';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauth' }, { status: 401 });
    }
    try {
        const { id } = verifyJwt(token);
        const user = await User.query()
            .findById(id)
            .select('id','name','email','avatar_url');
        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ error: 'Unauth' }, { status: 401 });
    }
}
