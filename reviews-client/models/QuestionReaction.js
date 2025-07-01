// src/models/QuestionReaction.js
import BaseModel from './BaseModel.js';
import Question from "@/models/Question";
import User from "@/models/User";

export default class QuestionReaction extends BaseModel {
    static tableName = 'question_reactions';

    static jsonSchema = {
        type: 'object',
        required: ['question_id','user_id','reaction'],
        properties: {
            id:          { type: 'integer' },
            question_id: { type: 'integer' },
            user_id:     { type: 'integer' },
            reaction:    { type: 'string', enum: ['like','dislike'] },
        },
    };

    static relationMappings = () => ({
        question: { relation: BaseModel.BelongsToOneRelation,
            modelClass: Question,
            join: { from: 'question_reactions.question_id', to: 'questions.id' } },
        user:     { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'question_reactions.user_id', to: 'users.id' } },
    });
}
