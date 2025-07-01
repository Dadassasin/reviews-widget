import { NextResponse } from 'next/server';
import Review from '@/models/Review';
import ReviewReport from '@/models/ReviewReport';

export async function DELETE(req, { params }) {
    const { id } = params;

    // Удаляем отзыв
    await Review.query().deleteById(id);

    // Чистим связанные жалобы
    await ReviewReport.query().delete().where('review_id', id);
    return NextResponse.json({ success: true });
}
