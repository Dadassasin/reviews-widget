// src/app/api/reports/[type]/[id]/resolve/route.js

import { NextResponse }      from 'next/server';
import { getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';
import ReviewReport          from '@/models/ReviewReport.js';
import CommentReport         from '@/models/CommentReport.js';
import QuestionReport        from '@/models/QuestionReport.js';
import AnswerReport          from '@/models/AnswerReport.js';

const reportMap = {
    review:   ReviewReport,
    comment:  CommentReport,
    question: QuestionReport,
    answer:   AnswerReport,
};

export async function POST(req, { params }) {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const { type, id } = await params;
    const reportId= Number(id);
    const Model = reportMap[type];
    if (!Model) return resp.bad('Unknown report type');

    await Model.query().deleteById(reportId);
    return NextResponse.json({ success: true });
}
