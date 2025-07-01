// src/models/QuestionAnswer.js
import BaseModel from './BaseModel.js';
import Question from "@/models/Question";
import User from "@/models/User";
import AnswerReaction from "@/models/AnswerReaction";
import AnswerReport from "@/models/AnswerReport";

export default class QuestionAnswer extends BaseModel {
    static tableName = 'question_answers';

    static jsonSchema = {
        type: 'object',
        required: ['question_id','text'],
        properties: {
            id:          { type: 'integer' },
            question_id: { type: 'integer' },
            author_id:   { type: ['integer','null'] },
            text:        { type: 'string' },
        },
    };

    static relationMappings = () => ({
        question: { relation: BaseModel.BelongsToOneRelation,
            modelClass: Question,
            join: { from: 'question_answers.question_id', to: 'questions.id' } },
        author:   { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'question_answers.author_id', to: 'users.id' } },
        reactions:{ relation: BaseModel.HasManyRelation,
            modelClass: AnswerReaction,
            join: { from: 'question_answers.id', to: 'answer_reactions.answer_id' } },
        reports: { relation: BaseModel.HasManyRelation,
            modelClass: AnswerReport,
            join: { from: 'question_answers.id', to: 'answer_reports.answer_id' } },
    });
}
