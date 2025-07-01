// app/api/analytics/route.js

import { NextResponse }       from 'next/server';
import { knex }               from '@/db/connection.js';
import Widget                 from '@/models/Widget.js';
import Review                 from '@/models/Review.js';
import Question               from '@/models/Question.js';
import QuestionAnswer         from '@/models/QuestionAnswer.js';
import { getAuthUser }        from '@/src/app/api/widgets/helpers.js';

function range(qb, from, to) {
    if (from) qb.where('created_at', '>=', from);
    if (to)   qb.where('created_at', '<=',  to + ' 23:59:59');
}

const SENTIMENTS = ['positive', 'neutral', 'negative'];
const EMOTIONS   = [
    'joy','interest','surprise','sadness','anger','disgust','fear','guilt','neutrality'
];

export async function GET(req) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const widgetKey = searchParams.get('widgetKey');
    const from      = searchParams.get('from');
    const to        = searchParams.get('to');

    const widgets = await Widget.query()
        .where('owner_id', user.id)
        .select(
            'id',
            'widget_key',
            'title',
            knex.raw("(config->>'name')::text AS name")
        )
        .orderBy('created_at');

    if (!widgets.length) {
        return NextResponse.json({ widgets: [], stats: null });
    }

    const widgetIds = widgets.map(w => w.id);
    const widgetByKey = Object.fromEntries(widgets.map(w => [w.widget_key, w.id]));

    let idsToUse = widgetIds;
    if (widgetKey) {
        const idFromKey = widgetByKey[widgetKey];
        if (!idFromKey) {
            return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
        }
        idsToUse = [idFromKey];
    }

    const revAgg = await knex('reviews')
        .whereIn('widget_id', idsToUse)
        .modify(qb => range(qb, from, to))
        .select([
            knex.raw('COUNT(*)                              AS total'),
            knex.raw('AVG(rating)::numeric(10,2)            AS avg_rating'),
            ...SENTIMENTS.map(s =>
                knex.raw(`COUNT(*) FILTER (WHERE sentiment='${s}') AS s_${s}`)
            ),
            ...[1,2,3,4,5].map(r =>
                knex.raw(`COUNT(*) FILTER (WHERE rating=${r}) AS r${r}`)
            )
        ])
        .first();

    const emoRows = await knex('reviews')
        .whereIn('widget_id', idsToUse)
        .modify(qb => range(qb, from, to))
        .groupBy('emotion')
        .select('emotion', knex.raw('COUNT(*) AS cnt'));

    const emotions = Object.fromEntries(EMOTIONS.map(e => [e, 0]));
    emoRows.forEach(r => {
        const key = r.emotion === 'neutral' ? 'neutrality' : (r.emotion || 'neutrality');
        emotions[key] = Number(r.cnt);
    });

    const qRows = await Question.query()
        .whereIn('widget_id', idsToUse)
        .modify(qb => range(qb, from, to))
        .select('id');

    const questionIds = qRows.map(r => r.id);
    const totalQuestions = questionIds.length;

    let answered = 0;
    if (questionIds.length) {
        const ansRows = await QuestionAnswer.query()
            .whereIn('question_id', questionIds)
            .groupBy('question_id')
            .count('* AS cnt');
        answered = ansRows.length;
    }

    const stats = {
        reviews: {
            total:       Number(revAgg?.total      ?? 0),
            avgRating:   Number(revAgg?.avg_rating ?? 0),
            sentiments: {
                positive:  Number(revAgg?.s_positive ?? 0),
                neutral:   Number(revAgg?.s_neutral  ?? 0),
                negative:  Number(revAgg?.s_negative ?? 0),
            },
            ratings: {
                5: Number(revAgg?.r5 ?? 0),
                4: Number(revAgg?.r4 ?? 0),
                3: Number(revAgg?.r3 ?? 0),
                2: Number(revAgg?.r2 ?? 0),
                1: Number(revAgg?.r1 ?? 0),
            },
            emotions
        },
        questions: {
            total:      totalQuestions,
            answered,
            unanswered: totalQuestions - answered
        }
    };

    return NextResponse.json({ widgets, stats });
}

export const POST = undefined;
