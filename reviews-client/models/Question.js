// src/models/Question.js
import BaseModel from './BaseModel.js';
import Widget from "@/models/Widget";
import User from "@/models/User";
import QuestionReaction from "@/models/QuestionReaction";
import QuestionAnswer from "@/models/QuestionAnswer";
import QuestionReport from "@/models/QuestionReport";

export default class Question extends BaseModel {
    static tableName = 'questions';

    static jsonSchema = {
        type: 'object',
        required: ['widget_id','text'],
        properties: {
            id:        { type: 'integer' },
            widget_id: { type: 'integer' },
            author_id: { type: ['integer','null'] },
            text:      { type: 'string' },
        },
    };

    static relationMappings = () => ({
        widget: { relation: BaseModel.BelongsToOneRelation,
            modelClass: Widget,
            join: { from: 'questions.widget_id', to: 'widgets.id' } },
        author: { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'questions.author_id', to: 'users.id' } },
        reactions: { relation: BaseModel.HasManyRelation,
            modelClass: QuestionReaction,
            join: { from: 'questions.id', to: 'question_reactions.question_id' } },
        answers: { relation: BaseModel.HasManyRelation,
            modelClass: QuestionAnswer,
            join: { from: 'questions.id', to: 'question_answers.question_id' } },
        reports: { relation: BaseModel.HasManyRelation,
            modelClass: QuestionReport,
            join: { from: 'questions.id', to: 'question_reports.question_id' } },
    });
}
