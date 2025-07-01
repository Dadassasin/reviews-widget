// src/app/api/delete/[type]/[id]/route.js

import { NextResponse }      from 'next/server';
import { getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';

// Основные модели
import Review         from '@/models/Review.js';
import ReviewComment  from '@/models/ReviewComment.js';
import Question       from '@/models/Question.js';
import QuestionAnswer from '@/models/QuestionAnswer.js';

// Модели жалоб
import ReviewReport   from '@/models/ReviewReport.js';
import CommentReport  from '@/models/CommentReport.js';
import QuestionReport from '@/models/QuestionReport.js';
import AnswerReport   from '@/models/AnswerReport.js';

const modelMap = {
    reviews:   Review,
    comments:  ReviewComment,
    questions: Question,
    answers:   QuestionAnswer,
};

const reportMap = {
    reviews:   ReviewReport,
    comments:  CommentReport,
    questions: QuestionReport,
    answers:   AnswerReport,
};

export async function DELETE(req, { params }) {
    // Проверяем авторизацию
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    // Достаём тип ("reviews","comments","questions","answers") и id из URL
    const { type, id } = await params;
    const objId = Number(id);

    const Model       = modelMap[type];
    const ReportModel = reportMap[type];
    if (!Model || !ReportModel) {
        return resp.bad('Unknown type');
    }

    // Сначала удаляем все жалобы на этот объект
    await ReportModel.query().delete().where(`${type.slice(0,-1)}_id`, objId);

    // Удаляем сам объект
    await Model.query().deleteById(objId);

    return NextResponse.json({ success: true });
}
