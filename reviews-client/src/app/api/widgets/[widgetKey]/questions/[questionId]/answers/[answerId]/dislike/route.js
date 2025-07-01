// app/api/widgets/[widgetKey]/questions/[questionId]/answers/[answerId]/dislike/route.js
import { NextResponse }                from 'next/server';
import { getWidget, getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';
import QuestionAnswer                  from '@/models/QuestionAnswer.js';
import AnswerReaction                  from '@/models/AnswerReaction.js';

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

    await AnswerReaction.query()
        .insert({ 
            answer_id: Number(answer.id), 
            user_id: Number(user.id), 
            reaction: 'dislike' 
        })
        .onConflict(['answer_id','user_id'])
        .merge({ reaction: 'dislike' });

    return NextResponse.json({ success: true });
}

export async function DELETE(req, ctx) {
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

    await AnswerReaction.query()
        .delete()
        .where({ 
            answer_id: Number(answer.id), 
            user_id: Number(user.id), 
            reaction: 'dislike' 
        });

    return NextResponse.json({ success: true });
}
