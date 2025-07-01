// src/models/ReviewReaction.js
import BaseModel from './BaseModel.js';
import Review from "@/models/Review";
import User from "@/models/User";

export default class ReviewReaction extends BaseModel {
    static tableName = 'review_reactions';

    static jsonSchema = {
        type: 'object',
        required: ['review_id','user_id','reaction'],
        properties: {
            id:        { type: 'integer' },
            review_id: { type: 'integer' },
            user_id:   { type: 'integer' },
            reaction:  { type: 'string', enum: ['like','dislike'] },
        },
    };

    static relationMappings = () => ({
        review: { relation: BaseModel.BelongsToOneRelation,
            modelClass: Review,
            join: { from: 'review_reactions.review_id', to: 'reviews.id' } },
        user:   { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'review_reactions.user_id', to: 'users.id' } },
    });
}
