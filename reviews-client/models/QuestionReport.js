// src/models/QuestionReport.js
import BaseModel from './BaseModel.js';
import Question from "@/models/Question";
import User from "@/models/User";

export default class QuestionReport extends BaseModel {
    static tableName = 'question_reports';

    static jsonSchema = {
        type: 'object',
        required: ['question_id','reason'],
        properties: {
            id:          { type: 'integer' },
            question_id: { type: 'integer' },
            user_id:     { type: ['integer','null'] },
            reason:      { type: 'string', enum: ['spam','offensive','false','other'] },
            comment:     { type: ['string','null'] },
        },
    };

    static relationMappings = () => ({
        reportedQuestion: { relation: BaseModel.BelongsToOneRelation,
            modelClass: Question,
            join: { from: 'question_reports.question_id', to: 'questions.id' } },
        user:     { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'question_reports.user_id', to: 'users.id' } },
    });
}
    