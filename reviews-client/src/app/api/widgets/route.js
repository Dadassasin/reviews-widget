// app/api/widgets/route.js

import '@/db/connection.js';
import { NextResponse } from 'next/server';
import Widget           from '@/models/Widget.js';
import { getAuthUser }  from '@/src/app/libs/auth-middleware.js';

export async function GET() {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauth' }, { status: 401 });
    }

    const widgets = await Widget.query()
        .select('id', 'widget_key', 'title', 'config', 'created_at')
        .where('owner_id', user.id)
        .orderBy('created_at');

    // Добавляем порядковый номер
    const withSeq = widgets.map((w, i) => ({
        ...w,
        seq: i + 1
    }));

    return NextResponse.json({ widgets: withSeq });
}

export async function POST(req) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauth' }, { status: 401 });
    }

    const { config = {}, title: customTitle } = await req.json();

    const existingCount = await Widget.query()
        .where('owner_id', user.id)
        .resultSize();

    const defaultTitle = `Widget ${existingCount + 1}`;

    const widget = await Widget.query().insertAndFetch({
        owner_id: user.id,
        title:    customTitle || defaultTitle,
        config
    });

    return NextResponse.json({ widget });
}

