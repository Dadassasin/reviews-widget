// app/api/widgets/[widgetKey]/questions/[questionId]/report/route.js
import { NextResponse } from 'next/server';
import { getWidget, getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';
import Question       from '@/models/Question.js';
import QuestionReport from '@/models/QuestionReport.js';

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

    const { reason, text = '' } = await req.json();
    if (!reason) return resp.bad('reason required');

    await QuestionReport.query().insert({
        question_id: Number(question.id),
        user_id:     Number(user.id),
        reason,
        comment:     text
    });

    return NextResponse.json({ success: true });
}
