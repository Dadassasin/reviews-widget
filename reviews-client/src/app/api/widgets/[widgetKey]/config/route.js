// src/app/api/widgets/[widgetKey]/config/route.js
import { NextResponse } from 'next/server';
import Widget           from '@/models/Widget.js';
import { getWidget, getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';
import { knex }         from '@/db/connection.js';

export async function GET(req, ctx) {
    const { widgetKey } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();
    const user = await getAuthUser();
    return NextResponse.json({
        isAuthenticated: !!user,
        user:            user ? user.$formatJson(user) : null,
        config:          widget.config || {},
    });
}

export async function PATCH(req, ctx) {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const { widgetKey } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget)                    return resp.notFound();
    if (widget.owner_id !== user.id) return resp.unauth();

    const { allowAnonymous } = await req.json();
    if (typeof allowAnonymous !== 'boolean') {
        return resp.bad('allowAnonymous must be boolean');
    }

    const newConfig = { ...widget.config, allowAnonymous };
    const updated = await Widget
        .query()
        .patchAndFetchById(widget.id, { config: newConfig });

    // пушим нотификацию в Postgres
    await knex.raw(`NOTIFY widget_config_updated, '${widgetKey}'`);

    return NextResponse.json({ widget: updated });
}
