// app/api/widgets/[widgetKey]/reviews/[reviewId]/report/route.js
import { NextResponse } from 'next/server';
import { getWidget, getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';
import Review       from '@/models/Review.js';
import ReviewReport from '@/models/ReviewReport.js'; // модель жалоб

export async function POST(req, ctx) {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const { widgetKey, reviewId } = await ctx.params;
    const widget = await getWidget(widgetKey);
    if (!widget) return resp.notFound();

    // проверяем, что отзыв в этом виджете
    const review = await Review.query()
        .findById(reviewId)
        .where('widget_id', widget.id);
    if (!review) return resp.notFound();

    // читаем тело запроса reason и text
    const { reason, text = '' } = await req.json();
    if (!reason) return resp.bad('reason required');

    // сохраняем жалобу
    await ReviewReport.query().insert({
        review_id: Number(review.id),
        user_id:   Number(user.id),
        reason,
        comment:   text
    });

    return NextResponse.json({ success: true });
}
