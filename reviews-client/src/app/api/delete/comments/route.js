import { NextResponse } from 'next/server';
import ReviewComment   from '@/models/ReviewComment.js';
import CommentReport   from '@/models/CommentReport.js';

export async function DELETE(req, { params }) {
    const { id } = params;

    // Удаляем комментарий
    await ReviewComment.query().deleteById(Number(id));

    // Удаляем все жалобы на этот комментарий
    await CommentReport.query()
        .delete()
        .where('comment_id', Number(id));

    return NextResponse.json({ success: true });
}
