// app/api/widgets/[widgetKey]/questions/route.js
import { NextResponse }                   from 'next/server';
import { getWidget, getAuthUser, resp }  from '@/src/app/api/widgets/helpers.js';
import Question                           from '@/models/Question.js';
import { knex }                          from '@/db/connection.js';

export async function GET(request, ctx) {
    const { widgetKey } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    // узнаём текущего пользователя
    let userId = null;
    try { userId = (await getAuthUser()).id; } catch {}

    // вопросы + лайки/дизлайки + свои реакции + count ответов
    const questions = await Question.query()
        .select('questions.*')
        .leftJoin(
            knex('question_reactions')
                .select(
                    'question_id',
                    knex.raw("SUM(CASE WHEN reaction='like' THEN 1 ELSE 0 END)::int AS likes"),
                    knex.raw("SUM(CASE WHEN reaction='dislike' THEN 1 ELSE 0 END)::int AS dislikes")
                )
                .groupBy('question_id')
                .as('agg'),
            'agg.question_id', 'questions.id'
        )
        .select(
            knex.raw(`(
        SELECT COUNT(*) 
          FROM question_answers 
         WHERE question_answers.question_id = questions.id
      )::int AS answers_count`)
        )
        .withGraphFetched('author(select)')
        .modifiers({
            select(builder) {
                builder.select('id','name', 'first_name', 'last_name', 'avatar_url');
            }
        })
        .select(
            knex.raw('COALESCE(agg.likes,0)    as likes'),
            knex.raw('COALESCE(agg.dislikes,0) as dislikes'),
            knex.raw(
                `(SELECT reaction
           FROM question_reactions
          WHERE question_id = questions.id
            AND user_id     = ?
          LIMIT 1) as "myReaction"`,
                [Number(userId)]
            )
        )
        .where('questions.widget_id', widget.id)
        .orderBy('questions.created_at', 'desc');

    // Статистика
    const total = questions.length;
    const answered = questions.filter(q => q.answers_count > 0).length;
    const unanswered = total - answered;

    const stats = {
        totalQuestions:   total,
        answeredCount:    answered,
        unansweredCount:  unanswered,
        answeredPercent:  total ? Math.round(answered * 100 / total) : 0,
        unansweredPercent: total ? Math.round(unanswered * 100 / total) : 0,
    };

    return NextResponse.json({ questions, stats });
}

export async function POST(request, ctx) {
    const { widgetKey } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    // проверяем, можно ли анонимно
    const allowAnon = Boolean(widget.config?.allowAnonymous);

    // пробуем получить пользователя
    let user = null;
    try { user = await getAuthUser(); } catch {}

    // если не залогинен и анонимка запрещена — 401
    if (!user && !allowAnon) {
        return resp.unauth();
    }

    const { text } = await request.json();
    if (!text?.trim()) {
        return resp.bad('text required');
    }

    // вставляем вопрос
    const inserted = await Question.query().insert({
        widget_id: widget.id,
        author_id: user ? user.id : null,
        text:      text.trim()
    });

    // собираем полный объект
    const full = await Question.query()
        .findById(inserted.id)
        .select('questions.*')
        .leftJoin(
            knex('question_reactions')
                .select(
                    'question_id',
                    knex.raw("SUM(CASE WHEN reaction='like' THEN 1 ELSE 0 END)::int AS likes"),
                    knex.raw("SUM(CASE WHEN reaction='dislike' THEN 1 ELSE 0 END)::int AS dislikes")
                )
                .groupBy('question_id')
                .as('agg'),
            'agg.question_id', 'questions.id'
        )
        .select(
            knex.raw(`(
        SELECT COUNT(*) 
          FROM question_answers 
         WHERE question_answers.question_id = questions.id
      )::int AS answers_count`)
        )
        .withGraphFetched('author(select)')
        .modifiers({
            select(builder) {
                builder.select('id','name', 'first_name', 'last_name', 'avatar_url');
            }
        })
        .select(
            knex.raw('COALESCE(agg.likes,0)    as likes'),
            knex.raw('COALESCE(agg.dislikes,0) as dislikes'),
            knex.raw(
                `(SELECT reaction
           FROM question_reactions
          WHERE question_id = questions.id
            AND user_id     = ?
          LIMIT 1) as "myReaction"`,
                [Number(user?.id ?? -1)]
            )
        );

    return NextResponse.json(full);
}
