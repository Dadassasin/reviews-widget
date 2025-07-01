// src/app/api/widgets/[widgetKey]/config/stream/route.js
import { NextResponse } from 'next/server';
import {getWidget, resp} from '@/src/app/api/widgets/helpers.js';
import { knex }        from '@/db/connection.js';

export async function GET(req, ctx) {
    // ждём params перед деструктуризацией
    const { widgetKey } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    // берём нативное соединение из пула knex
    const conn = await knex.client.acquireConnection();
    await conn.query('LISTEN widget_config_updated');

    const stream = new ReadableStream({
        async start(controller) {
            // сразу шлём текущий конфиг
            controller.enqueue(
                `event: config\ndata: ${JSON.stringify(widget.config)}\n\n`
            );

            // на каждую нотификацию
            conn.on('notification', async msg => {
                if (
                    msg.channel === 'widget_config_updated' &&
                    msg.payload === widgetKey
                ) {
                    const fresh = (await getWidget(widgetKey)).config;
                    controller.enqueue(
                        `event: config\ndata: ${JSON.stringify(fresh)}\n\n`
                    );
                }
            });

            // keepalive
            controller.enqueue(': keepalive\n\n');
        },
        cancel() {
            conn.removeAllListeners('notification');
            knex.client.releaseConnection(conn);
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type':      'text/event-stream',
            'Cache-Control':     'no-cache, no-transform',
            'X-Accel-Buffering': 'no'
        }
    });
}

