// app/api/profile/route.js
import { NextResponse } from 'next/server';
import { getAuthUser } from '@/src/app/api/widgets/helpers.js';
import { promises as fs } from 'fs';
import path from 'path';
import { knex } from '@/db/connection';

import Review         from '@/models/Review.js';
import ReviewComment  from '@/models/ReviewComment.js';
import Question       from '@/models/Question.js';
import QuestionAnswer from '@/models/QuestionAnswer.js';
import User           from '@/models/User.js';

export async function GET(req) {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'unauth' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const take = Number(searchParams.get('take') ?? 10);
    const page = Number(searchParams.get('page') ?? 1);
    const offset = (page - 1) * take;

    const [reviews, comments, questions, answers] = await Promise.all([
        Review.query().where('author_id', user.id)
            .orderBy('created_at', 'desc').limit(take).offset(offset),
        ReviewComment.query().where('author_id', user.id)
            .orderBy('created_at', 'desc').limit(take).offset(offset),
        Question.query().where('author_id', user.id)
            .orderBy('created_at', 'desc').limit(take).offset(offset),
        QuestionAnswer.query().where('author_id', user.id)
            .orderBy('created_at', 'desc').limit(take).offset(offset),
    ]);

    const profile = {
        id: user.id,
        name: user.name,
        first_name: user.first_name,
        last_name:  user.last_name,
        email: user.email,
        avatar_url: user.avatar_url ?? null,
    };

    return NextResponse.json({ profile, reviews, comments, questions, answers });
}

// обновление аватара
export async function POST(req) {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'unauth' }, { status: 401 });

    const data = await req.formData();
    const file = data.get('avatar');
    if (!(file instanceof File)) {
        return NextResponse.json({ error: 'file required' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    const filename = `${user.id}-${Date.now()}${ext}`;
    const dest = path.join(uploadDir, filename);
    await fs.writeFile(dest, Buffer.from(await file.arrayBuffer()));

    const url = `/uploads/avatars/${filename}`;

    await User.query().findById(user.id).patch({ avatar_url: url });

    return NextResponse.json({ avatar_url: url });
}
