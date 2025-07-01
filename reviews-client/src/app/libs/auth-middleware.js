// src/app/libs/auth-middleware.js
import { cookies }   from 'next/headers';
import { verifyJwt } from '@/src/app/libs/auth.js';
import User          from '@/models/User.js';

export async function getAuthUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    try {
        const { id } = verifyJwt(token);
        // выбираем только нужные поля
        return await User.query()
            .findById(id)
            .select('id', 'name', 'email', 'avatar_url');
    } catch {
        return null;
    }
}
