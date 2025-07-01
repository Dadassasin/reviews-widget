// src/models/AnswerReport.js
import BaseModel from './BaseModel.js';
import QuestionAnswer from "@/models/QuestionAnswer";
import User from "@/models/User";

export default class AnswerReport extends BaseModel {
    static tableName = 'answer_reports';

    static jsonSchema = {
        type: 'object',
        required: ['answer_id','reason'],
        properties: {
            id:        { type: 'integer' },
            answer_id: { type: 'integer' },
            user_id:   { type: ['integer','null'] },
            reason:    { type: 'string', enum: ['spam','offensive','false','other'] },
            comment:   { type: ['string','null'] },
        },
    };

    static relationMappings = () => ({
        reportedAnswer: { relation: BaseModel.BelongsToOneRelation,
            modelClass: QuestionAnswer,
            join: { from: 'answer_reports.answer_id', to: 'question_answers.id' } },
        user:   { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'answer_reports.user_id', to: 'users.id' } },
    });
}
