import { NextResponse } from 'next/server';
import Question        from '@/models/Question.js';
import QuestionReport  from '@/models/QuestionReport.js';

export async function DELETE(req, { params }) {
    const { id } = params;

    // Удаляем вопрос
    await Question.query().deleteById(Number(id));

    // Удаляем все жалобы на этот вопрос
    await QuestionReport.query()
        .delete()
        .where('question_id', Number(id));

    return NextResponse.json({ success: true });
}
