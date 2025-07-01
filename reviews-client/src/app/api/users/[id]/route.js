// src/app/api/users/[id]/route.js

import { NextResponse } from 'next/server'
import { getAuthUser } from '@/src/app/api/widgets/helpers.js'
import User             from '@/models/User.js'
import Review           from '@/models/Review.js'
import ReviewComment    from '@/models/ReviewComment.js'
import Question         from '@/models/Question.js'
import QuestionAnswer   from '@/models/QuestionAnswer.js'

export async function GET(req, { params }) {
    let me = null
    try {
        me = await getAuthUser()
    } catch { }

    const { id } = await params
    const take   = 12
    const page   = Number(new URL(req.url).searchParams.get('page') ?? 1)
    const offset = (page - 1) * take

    const user = await User.query()
        .findById(id)
        .select('id', 'name', 'first_name', 'last_name', 'email', 'avatar_url')

    if (!user) {
        return NextResponse.json(
            { error: 'Пользователь не найден' },
            { status: 404 }
        )
    }

    const [reviews, comments, questions, answers] = await Promise.all([
        Review.query()
            .where('author_id', id)
            .orderBy('created_at', 'desc')
            .limit(take)
            .offset(offset),
        ReviewComment.query()
            .where('author_id', id)
            .orderBy('created_at', 'desc')
            .limit(take)
            .offset(offset),
        Question.query()
            .where('author_id', id)
            .orderBy('created_at', 'desc')
            .limit(take)
            .offset(offset),
        QuestionAnswer.query()
            .where('author_id', id)
            .orderBy('created_at', 'desc')
            .limit(take)
            .offset(offset),
    ])

    return NextResponse.json({
        profile:   user,
        reviews,
        comments,
        questions,
        answers,
    })
}
