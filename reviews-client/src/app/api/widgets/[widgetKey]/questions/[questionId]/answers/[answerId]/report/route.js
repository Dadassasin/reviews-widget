// app/api/widgets/[widgetKey]/questions/[questionId]/answers/[answerId]/report/route.js
import { NextResponse } from 'next/server';
import { getWidget, getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';
import QuestionAnswer from '@/models/QuestionAnswer.js';
import AnswerReport   from '@/models/AnswerReport.js';

export async function POST(req, ctx) {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const { widgetKey, answerId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    const answer = await QuestionAnswer.query()
        .findById(answerId)
        .joinRelated('question')
        .where('question.widget_id', widget.id)
        .first();
    if (!answer) return resp.notFound();

    const { reason, text = '' } = await req.json();
    if (!reason) return resp.bad('reason required');

    await AnswerReport.query().insert({
        answer_id: Number(answer.id),
        user_id:   Number(user.id),
        reason,
        comment:   text
    });

    return NextResponse.json({ success: true });
}
