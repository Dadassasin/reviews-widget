// src/app/api/reports/route.js

import { NextResponse }      from 'next/server';
import { getAuthUser, resp } from '@/src/app/api/widgets/helpers.js';
import ReviewReport          from '@/models/ReviewReport.js';
import CommentReport         from '@/models/CommentReport.js';
import QuestionReport        from '@/models/QuestionReport.js';
import AnswerReport          from '@/models/AnswerReport.js';

export async function GET() {
    const user = await getAuthUser();
    if (!user) return resp.unauth();

    const [rr, cr, qr, ar] = await Promise.all([

        // Жалобы на отзывы виджетов пользователя
        ReviewReport.query()
            .joinRelated('reportedReview.widget')
            .where('reportedReview:widget.owner_id', user.id)
            .withGraphFetched('reportedReview.[author, widget]'),

        // Жалобы на комментарии к отзывам виджетов пользователя
        CommentReport.query()
            .joinRelated('reportedComment.review.widget')
            .where('reportedComment:review:widget.owner_id', user.id)
            .withGraphFetched('reportedComment.[author, review.[widget]]'),

        // Жалобы на вопросы виджетов пользователя
        QuestionReport.query()
            .joinRelated('reportedQuestion.widget')
            .where('reportedQuestion:widget.owner_id', user.id)
            .withGraphFetched('reportedQuestion.[author, widget]'),

        // Жалобы на ответы к вопросам виджетов пользователя
        AnswerReport.query()
            .joinRelated('reportedAnswer.question.widget')
            .where('reportedAnswer:question:widget.owner_id', user.id)
            .withGraphFetched('reportedAnswer.[author, question.[widget]]'),

    ]);

    return NextResponse.json({
        reviewReports:   rr,
        commentReports:  cr,
        questionReports: qr,
        answerReports:   ar
    });
}
