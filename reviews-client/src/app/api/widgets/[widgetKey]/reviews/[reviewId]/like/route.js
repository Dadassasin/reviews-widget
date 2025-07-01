// app/api/widgets/[widgetKey]/reviews/[reviewId]/like/route.js
import { NextResponse } from 'next/server';
import { getWidget, getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';
import Review         from '@/models/Review.js';
import ReviewReaction from '@/models/ReviewReaction.js';

export async function POST(req, ctx) {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const params = await ctx.params;
    const { widgetKey, reviewId } = params;

    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    const review = await Review.query()
        .findById(reviewId)
        .where('widget_id', widget.id);
    if (!review) return resp.notFound();

    await ReviewReaction.query()
        .insert({
            review_id: Number(review.id),
            user_id:   Number(user.id),
            reaction:  'like'
        })
        .onConflict(['review_id','user_id'])
        .merge({ reaction: 'like' });

    return NextResponse.json({ success: true });
}

export async function DELETE(req, ctx) {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const { widgetKey, reviewId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    const review = await Review.query()
        .findById(reviewId)
        .where('widget_id', widget.id);
    if (!review) return resp.notFound();

    await ReviewReaction.query()
        .delete()
        .where({
            review_id: Number(reviewId),
            user_id: Number(user.id),
            reaction: 'like'
        });

    return NextResponse.json({ success: true });
}