// src/models/Widget.js
import BaseModel from './BaseModel.js';
import User from "@/models/User";
import Review from "@/models/Review";
import Question from "@/models/Question";

export default class Widget extends BaseModel {
    static tableName = 'widgets';

    static jsonSchema = {
        type: 'object',
        required: ['owner_id'],
        properties: {
            id:         { type: 'integer' },
            owner_id:   { type: 'integer' },
            widget_key: { type: 'string', format: 'uuid' },
            title:      { type: 'string', minLength: 1, maxLength: 255 },
            config:     { type: 'object' },
        },
    };

    static relationMappings = () => ({
        owner:  { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'widgets.owner_id', to: 'users.id' } },

        reviews:{ relation: BaseModel.HasManyRelation,
            modelClass: Review,
            join: { from: 'widgets.id', to: 'reviews.widget_id' } },

        questions:{ relation: BaseModel.HasManyRelation,
            modelClass: Question,
            join: { from: 'widgets.id', to: 'questions.widget_id' } },
    });
}
