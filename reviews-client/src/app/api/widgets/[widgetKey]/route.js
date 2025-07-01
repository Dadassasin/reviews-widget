// файл: app/api/widgets/[widgetKey]/route.js

import { NextResponse } from 'next/server';
import Widget           from '@/models/Widget.js';
import { getAuthUser }  from '@/src/app/libs/auth-middleware.js';

export async function DELETE(req, ctx) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauth' }, { status: 401 });
    }

    const { widgetKey } = await ctx.params
    const widgetId = Number(widgetKey)
    if (Number.isNaN(widgetId)) return resp.bad('Invalid widget id')

    const deleted = await Widget.query()
        .delete()
        .where({ id: widgetId, owner_id: user.id });

    if (!deleted) {
        return NextResponse.json(
            { error: 'Not found or forbidden' },
            { status: 404 }
        );
    }

    return NextResponse.json({ success: true });
}

export async function PATCH(req, { params }) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauth' }, { status: 401 });
    }

    const { widgetKey } = await params;

    // Находим наш виджет по его ключу
    const widget = await Widget.query().findOne({ widget_key: widgetKey });
    if (!widget || widget.owner_id !== user.id) {
        return NextResponse.json({ error: 'NotFound' }, { status: 404 });
    }

    const { title } = await req.json();
    if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json({ error: 'Title required' }, { status: 400 });
    }

    // Обновляем только столбец title
    const updated = await Widget.query()
        .patchAndFetchById(widget.id, { title: title.trim() });

    return NextResponse.json({ widget: updated });
}