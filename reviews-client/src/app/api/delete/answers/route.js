import { NextResponse } from 'next/server';
import QuestionAnswer  from '@/models/QuestionAnswer.js';
import AnswerReport    from '@/models/AnswerReport.js';

export async function DELETE(req, { params }) {
    const { id } = params;

    // Удаляем ответ
    await QuestionAnswer.query().deleteById(Number(id));

    // Удаляем все жалобы на этот ответ
    await AnswerReport.query()
        .delete()
        .where('answer_id', Number(id));

    return NextResponse.json({ success: true });
}
