// app/api/widgets/helpers.js
import '@/db/connection.js';
import { NextResponse } from 'next/server';
import { cookies }      from 'next/headers';
import { verifyJwt }    from '@/src/app/libs/auth.js';
import Widget           from '@/models/Widget.js';
import User             from '@/models/User.js';
import Review           from "@/models/Review";
import Question         from "@/models/Question";
import ReviewComment    from "@/models/ReviewComment";
import QuestionAnswer   from "@/models/QuestionAnswer";

export async function getWidget(key) {
    return Widget.query().findOne({ widget_key: key });
}

export async function getAuthUser() {
    const store = await cookies();
    const jwt   = store.get('token')?.value;
    if (!jwt) return null;

    try {
        const { id } = verifyJwt(jwt);
        return await User.query().findById(id);
    } catch {
        return null;
    }
}

export const resp = {
    unauth:   () => NextResponse.json({ error: 'Unauth'   }, { status: 401 }),
    notFound: () => NextResponse.json({ error: 'NotFound' }, { status: 404 }),
    bad:      msg => NextResponse.json({ error: msg       }, { status: 400 }),
};