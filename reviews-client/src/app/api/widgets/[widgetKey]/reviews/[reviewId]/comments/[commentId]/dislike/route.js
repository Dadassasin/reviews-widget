// app/api/widgets/[widgetKey]/reviews/[reviewId]/comments/[commentId]/dislike/route.js
import { NextResponse }                  from 'next/server';
import { getWidget, getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';
import ReviewComment                     from '@/models/ReviewComment.js';
import CommentReaction                   from '@/models/CommentReaction.js';

export async function POST(req, ctx) {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const { widgetKey, reviewId, commentId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    const comment = await ReviewComment.query()
        .findById(commentId)
        .joinRelated('review')
        .where('review.widget_id', widget.id)
        .first();
    if (!comment) return resp.notFound();

    await CommentReaction.query()
        .insert({
            comment_id: comment.id,
            user_id:    user.id,
            reaction:   'dislike'
        })
        .onConflict(['comment_id','user_id'])
        .merge({ reaction: 'dislike' });

    return NextResponse.json({ success: true });
}

export async function DELETE(req, ctx) {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const { widgetKey, reviewId, commentId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    const comment = await ReviewComment.query()
        .findById(commentId)
        .joinRelated('review')
        .where('review.widget_id', widget.id)
        .first();
    if (!comment) return resp.notFound();

    await CommentReaction.query()
        .delete()
        .where({
            comment_id: Number(commentId),
            user_id:    Number(user.id),
            reaction:   'dislike'
        });

    return NextResponse.json({ success: true });
}
