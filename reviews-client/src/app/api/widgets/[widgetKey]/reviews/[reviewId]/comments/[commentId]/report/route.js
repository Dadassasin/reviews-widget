// app/api/widgets/[widgetKey]/reviews/[reviewId]/comments/[commentId]/report/route.js
import { NextResponse } from 'next/server';
import { getWidget, getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';
import ReviewComment from '@/models/ReviewComment.js';
import CommentReport from '@/models/CommentReport.js';

export async function POST(req, ctx) {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const { widgetKey, commentId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    const comment = await ReviewComment.query()
        .findById(commentId)
        .joinRelated('review')
        .where('review.widget_id', widget.id)
        .first();
    if (!comment) return resp.notFound();

    const { reason, text = '' } = await req.json();
    if (!reason) return resp.bad('reason required');

    await CommentReport.query().insert({
        comment_id: Number(comment.id),
        user_id: Number(user.id),
        reason,
        comment: text
    });

    return NextResponse.json({ success: true });
}
