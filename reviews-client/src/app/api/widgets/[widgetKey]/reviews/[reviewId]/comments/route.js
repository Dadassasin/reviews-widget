// app/api/widgets/[widgetKey]/reviews/[reviewId]/comments/route.js
import { NextResponse }                   from 'next/server';
import { getWidget, getAuthUser, resp }  from '@/src/app/api/widgets/helpers.js';
import Review                             from '@/models/Review.js';
import ReviewComment                      from '@/models/ReviewComment.js';
import { knex }                           from '@/db/connection.js';

// GET — получить комментарии с агрегированными реакциями
export async function GET(req, ctx) {
    const { widgetKey, reviewId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    const review = await Review.query()
        .findById(reviewId)
        .where('widget_id', widget.id);
    if (!review) return resp.notFound();

    // текущий пользователь (для myReaction)
    let userId = null;
    try {
        userId = (await getAuthUser()).id;
    } catch {}

    const comments = await ReviewComment.query()
        .select('review_comments.*')
        // лайки/дизлайки
        .leftJoin(
            knex('comment_reactions')
                .select(
                    'comment_id',
                    knex.raw("SUM(CASE WHEN reaction='like' THEN 1 ELSE 0 END)::int AS likes"),
                    knex.raw("SUM(CASE WHEN reaction='dislike' THEN 1 ELSE 0 END)::int AS dislikes")
                )
                .groupBy('comment_id')
                .as('agg'),
            'agg.comment_id', 'review_comments.id'
        )
        // myReaction
        .select(
            knex.raw('COALESCE(agg.likes,0)    as likes'),
            knex.raw('COALESCE(agg.dislikes,0) as dislikes'),
            knex.raw(
                `(SELECT reaction
           FROM comment_reactions
          WHERE comment_id = review_comments.id
            AND user_id    = ?
          LIMIT 1) as "myReaction"`,
                [Number(userId)]
            )
        )
        // подтягиваем автора (может быть null)
        .withGraphFetched('author(select)')
        .modifiers({
            select(builder) {
                builder.select('id','name', 'first_name', 'last_name', 'avatar_url');
            }
        })
        .where('review_id', reviewId)
        .orderBy('created_at');

    return NextResponse.json({ comments });
}

export async function POST(req, ctx) {
    const { widgetKey, reviewId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    // проверяем, можно ли анонимить
    const allowAnon = Boolean(widget.config?.allowAnonymous);

    let user = null;
    try {
        user = await getAuthUser();
    } catch {}

    if (!user && !allowAnon) {
        // если не залогинен и анонимка запрещена
        return resp.unauth();
    }

    // убеждаемся, что комментируемый отзыв принадлежит этому виджету
    const review = await Review.query()
        .findById(reviewId)
        .where('widget_id', widget.id);
    if (!review) return resp.notFound();

    const { text } = await req.json();
    if (!text?.trim()) return resp.bad('text required');

    // вставляем с author_id = user.id или null
    const inserted = await ReviewComment.query().insert({
        review_id: Number(review.id),
        author_id: user ? user.id : null,
        text:      text.trim()
    });

    // возвращаем вставленный коммент
    const full = await ReviewComment.query()
        .select('review_comments.*')
        .leftJoin(
            knex('comment_reactions')
                .select(
                    'comment_id',
                    knex.raw("SUM(CASE WHEN reaction='like' THEN 1 ELSE 0 END)::int AS likes"),
                    knex.raw("SUM(CASE WHEN reaction='dislike' THEN 1 ELSE 0 END)::int AS dislikes")
                )
                .groupBy('comment_id')
                .as('agg'),
            'agg.comment_id', 'review_comments.id'
        )
        .select(
            knex.raw('COALESCE(agg.likes,0)    as likes'),
            knex.raw('COALESCE(agg.dislikes,0) as dislikes'),
            knex.raw(
                `(SELECT reaction
           FROM comment_reactions
          WHERE comment_id = review_comments.id
            AND user_id    = ?
          LIMIT 1) as "myReaction"`,
                [Number(user?.id ?? -1)]
            )
        )
        .withGraphFetched('author(select)')
        .modifiers({
            select(builder) {
                builder.select('id','name', 'first_name', 'last_name', 'avatar_url');
            }
        })
        .findById(inserted.id);

    return NextResponse.json(full);
}
