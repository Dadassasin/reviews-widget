// app/api/widgets/[widgetKey]/reviews/route.js
import { NextResponse }                   from 'next/server';
import { getWidget, getAuthUser, resp }  from '@/src/app/api/widgets/helpers.js';
import Review                             from '@/models/Review.js';
import ReviewMedia                        from '@/models/ReviewMedia.js';
import { promises as fs }                from 'fs';
import path                               from 'path';
import { knex }                           from '@/db/connection.js';

export const config = {
    api: { bodyParser: false }
};

export async function GET(request, ctx) {
    const { widgetKey } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    let userId = null;
    try {
        userId = (await getAuthUser()).id;
    } catch {}

    const reviews = await Review.query()
        .select('reviews.*')
        // агрегируем лайки/дизлайки
        .leftJoin(
            knex('review_reactions')
                .select(
                    'review_id',
                    knex.raw("SUM(CASE WHEN reaction='like' THEN 1 ELSE 0 END)::int AS likes"),
                    knex.raw("SUM(CASE WHEN reaction='dislike' THEN 1 ELSE 0 END)::int AS dislikes")
                )
                .groupBy('review_id')
                .as('agg'),
            'agg.review_id', 'reviews.id'
        )
        // count комментариев
        .select(
            knex.raw(`(
        SELECT COUNT(*)
          FROM review_comments
         WHERE review_comments.review_id = reviews.id
      )::int AS comments_count`)
        )
        // подтягиваем автора и медиа
        .withGraphFetched('[author(select), media]')
        .modifiers({
            select(builder) {
                builder.select('id', 'name', 'first_name', 'last_name', 'avatar_url');
            }
        })
        // свои лайк/дизлайк
        .select(
            knex.raw('COALESCE(agg.likes,0)    as likes'),
            knex.raw('COALESCE(agg.dislikes,0) as dislikes'),
            knex.raw(
                `(SELECT reaction
           FROM review_reactions
          WHERE review_id = reviews.id
            AND user_id   = ?
          LIMIT 1) as "myReaction"`,
                [Number(userId)]
            )
        )
        .where('reviews.widget_id', widget.id)
        .orderBy('reviews.created_at', 'desc');

    const totalCount = reviews.length;
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
    const emotionCounts   = {
        joy: 0, interest: 0, surprise: 0, sadness: 0,
        anger: 0, disgust: 0, fear: 0, guilt: 0, neutrality: 0
    };

    for (const r of reviews) {
        const s = r.sentiment || 'neutral';
        if (sentimentCounts[s] != null) sentimentCounts[s]++;
        const e = r.emotion === 'neutral' ? 'neutrality' : r.emotion;
        if (emotionCounts[e] != null) emotionCounts[e]++;
    }

    const sentiments = Object.fromEntries(
        Object.entries(sentimentCounts).map(([k,v]) =>
            [k, totalCount ? Math.round(v*100/totalCount) : 0]
        )
    );
    const emotions = Object.fromEntries(
        Object.entries(emotionCounts).map(([k,v]) =>
            [k, totalCount ? Math.round(v*100/totalCount) : 0]
        )
    );

    const stat = await Review.query()
        .where('widget_id', widget.id)
        .avg('rating as avg')
        .count('id as total')
        .first();

    const distribution = await knex('reviews')
        .select('rating as stars')
        .count('*')
        .where('widget_id', widget.id)
        .groupBy('rating')
        .orderBy('rating', 'desc')
        .then(rows => rows.map(r => ({
            stars:   r.stars,
            percent: stat.total ? Math.round(r.count*100/stat.total) : 0
        })));

    return NextResponse.json({
        reviews,
        stats: {
            average:      Number(stat.avg)   || 0,
            total:        Number(stat.total) || 0,
            distribution,
            sentiments,
            emotions
        }
    });
}

export async function POST(request, ctx) {
    const { widgetKey } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    const user = await getAuthUser().catch(() => null);
    const isAnonAllowed = widget.config?.allowAnonymous === true;

    // если не залогинен и анонимка запрещена — ошибка
    if (!user && !isAnonAllowed) {
        return resp.unauth();
    }

    // читаем форму
    const formData = await request.formData();
    const rating   = Number(formData.get('rating'));
    const text     = String(formData.get('text') || '').trim();
    if (!rating || !text) {
        return resp.bad('rating & text required');
    }

    // сохраняем файлы
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const files = formData.getAll('files');
    const mediaRecords = [];
    for (const file of files) {
        if (!(file instanceof File)) continue;
        const ext  = path.extname(file.name);
        const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        const dest = path.join(uploadDir, name);
        const buf  = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(dest, buf);
        mediaRecords.push({ url: `/uploads/${name}` });
    }

    // sentiment/emotion
    let sentiment = null, emotion = null;
    try {
        const svc = await fetch('http://localhost:9000/analyze', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ texts: [text] })
        });
        if (svc.ok) {
            const { results } = await svc.json();
            sentiment = results[0].top_sentiment;
            emotion   = results[0].top_emotion;
        }
    } catch {}

    // author_id = null для анонимов
    const review = await Review.query().insert({
        widget_id: widget.id,
        author_id: user ? user.id : null,
        rating,
        text,
        sentiment,
        emotion
    });

    if (mediaRecords.length) {
        await ReviewMedia.query().insert(
            mediaRecords.map(m => ({ review_id: Number(review.id), url: m.url }))
        );
    }

    // возвращаем полный объект, как в GET
    const full = await Review.query()
        .select('reviews.*')
        .leftJoin(
            knex('review_reactions')
                .select(
                    'review_id',
                    knex.raw("SUM(CASE WHEN reaction='like' THEN 1 ELSE 0 END)::int AS likes"),
                    knex.raw("SUM(CASE WHEN reaction='dislike' THEN 1 ELSE 0 END)::int AS dislikes")
                )
                .groupBy('review_id')
                .as('agg'),
            'agg.review_id', 'reviews.id'
        )
        .select(
            knex.raw('COALESCE(agg.likes,0)    as likes'),
            knex.raw('COALESCE(agg.dislikes,0) as dislikes'),
            knex.raw(
                `(SELECT reaction
           FROM review_reactions
          WHERE review_id = reviews.id
            AND user_id   = ?
          LIMIT 1) as "myReaction"`,
                [Number(user?.id ?? -1)]
            ),
            knex.raw(`(
        SELECT COUNT(*)
          FROM review_comments
         WHERE review_comments.review_id = reviews.id
      )::int AS comments_count`)
        )
        .withGraphFetched('[author(select), media]')
        .modifiers({
            select(builder) {
                builder.select('id', 'name', 'first_name', 'last_name', 'avatar_url');
            }
        })
        .findById(Number(review.id));

    return NextResponse.json(full);
}
