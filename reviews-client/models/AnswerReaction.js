// src/models/AnswerReaction.js
import BaseModel from './BaseModel.js';
import QuestionAnswer from "@/models/QuestionAnswer";
import User from "@/models/User";

export default class AnswerReaction extends BaseModel {
    static tableName = 'answer_reactions';

    static jsonSchema = {
        type: 'object',
        required: ['answer_id','user_id','reaction'],
        properties: {
            id:        { type: 'integer' },
            answer_id: { type: 'integer' },
            user_id:   { type: 'integer' },
            reaction:  { type: 'string', enum: ['like','dislike'] },
        },
    };

    static relationMappings = () => ({
        answer: { relation: BaseModel.BelongsToOneRelation,
            modelClass: QuestionAnswer,
            join: { from: 'answer_reactions.answer_id', to: 'question_answers.id' } },
        user:   { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'answer_reactions.user_id', to: 'users.id' } },
    });
}
