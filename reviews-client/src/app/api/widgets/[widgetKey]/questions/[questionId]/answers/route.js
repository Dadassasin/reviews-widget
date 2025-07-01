// app/api/widgets/[widgetKey]/questions/[questionId]/answers/route.js
import { NextResponse }                   from 'next/server';
import { getWidget, getAuthUser, resp }  from '@/src/app/api/widgets/helpers.js';
import Question                           from '@/models/Question.js';
import QuestionAnswer                     from '@/models/QuestionAnswer.js';
import { knex }                           from '@/db/connection.js';

export async function GET(req, ctx) {
    const { widgetKey, questionId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    // убеждаемся, что вопрос принадлежит этому виджету
    const question = await Question.query()
        .findById(questionId)
        .where('widget_id', widget.id);
    if (!question) return resp.notFound();

    // текущий пользователь для myReaction
    let userId = null;
    try { userId = (await getAuthUser()).id; } catch {}

    // собираем ответы
    const answers = await QuestionAnswer.query()
        .select('question_answers.*')
        .leftJoin(
            knex('answer_reactions')
                .select(
                    'answer_id',
                    knex.raw("SUM(CASE WHEN reaction='like' THEN 1 ELSE 0 END)::int AS likes"),
                    knex.raw("SUM(CASE WHEN reaction='dislike' THEN 1 ELSE 0 END)::int AS dislikes")
                )
                .groupBy('answer_id')
                .as('agg'),
            'agg.answer_id', 'question_answers.id'
        )
        .select(
            knex.raw('COALESCE(agg.likes, 0)    as likes'),
            knex.raw('COALESCE(agg.dislikes, 0) as dislikes'),
            knex.raw(
                `(SELECT reaction
           FROM answer_reactions
          WHERE answer_id = question_answers.id
            AND user_id   = ?
          LIMIT 1) as "myReaction"`,
                [Number(userId)]
            )
        )
        .withGraphFetched('author(select)')
        .modifiers({
            select(builder) {
                builder.select('id', 'name', 'first_name', 'last_name', 'avatar_url');
            }
        })
        .where('question_id', Number(question.id))
        .orderBy('created_at', 'asc');

    return NextResponse.json({ answers });
}

export async function POST(req, ctx) {
    const { widgetKey, questionId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    // проверяем, что вопрос в нашем виджете
    const question = await Question.query()
        .findById(questionId)
        .where('widget_id', widget.id);
    if (!question) return resp.notFound();

    // разрешена ли анонимная публикация
    const allowAnon = Boolean(widget.config?.allowAnonymous);

    let user = null;
    try { user = await getAuthUser(); } catch {}

    // если не залогинен и анонимка запрещена — 401
    if (!user && !allowAnon) {
        return resp.unauth();
    }

    // читаем текст
    const { text } = await req.json();
    if (!text?.trim()) {
        return resp.bad('text required');
    }

    // вставляем ответ
    const inserted = await QuestionAnswer.query().insert({
        question_id: Number(question.id),
        author_id:   user ? user.id : null,
        text:        text.trim()
    });

    // собираем вновь созданный ответ с реакциями и автором
    const full = await QuestionAnswer.query()
        .select('question_answers.*')
        .leftJoin(
            knex('answer_reactions')
                .select(
                    'answer_id',
                    knex.raw("SUM(CASE WHEN reaction='like' THEN 1 ELSE 0 END)::int AS likes"),
                    knex.raw("SUM(CASE WHEN reaction='dislike' THEN 1 ELSE 0 END)::int AS dislikes")
                )
                .groupBy('answer_id')
                .as('agg'),
            'agg.answer_id', 'question_answers.id'
        )
        .select(
            knex.raw('COALESCE(agg.likes, 0)    as likes'),
            knex.raw('COALESCE(agg.dislikes, 0) as dislikes'),
            knex.raw(
                `(SELECT reaction
           FROM answer_reactions
          WHERE answer_id = question_answers.id
            AND user_id   = ?
          LIMIT 1) as "myReaction"`,
                [Number(user?.id ?? -1)]
            )
        )
        .withGraphFetched('author(select)')
        .modifiers({
            select(builder) {
                builder.select('id', 'name', 'first_name', 'last_name', 'avatar_url');
            }
        })
        .findById(inserted.id);

    return NextResponse.json({ answer: full });
}
