// app/api/widgets/[widgetKey]/questions/[questionId]/dislike/route.js
import { NextResponse } from 'next/server';
import { getWidget, getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';
import Question         from '@/models/Question.js';
import QuestionReaction from '@/models/QuestionReaction.js';

export async function POST(req, ctx) {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const { widgetKey, questionId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    const question = await Question.query()
        .findById(questionId)
        .where('widget_id', widget.id);
    if (!question) return resp.notFound();

    await QuestionReaction.query()
        .insert({
            question_id: Number(question.id),
            user_id:     Number(user.id),
            reaction:    'dislike'
        })
        .onConflict(['question_id','user_id'])
        .merge({ reaction: 'dislike' });

    return NextResponse.json({ success: true });
}

export async function DELETE(req, ctx) {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const { widgetKey, questionId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    const question = await Question.query()
        .findById(questionId)
        .where('widget_id', widget.id);
    if (!question) return resp.notFound();

    await QuestionReaction.query()
        .delete()
        .where({
            question_id: Number(question.id),
            user_id:     Number(user.id),
            reaction:    'dislike'
        });

    return NextResponse.json({ success: true });
}
