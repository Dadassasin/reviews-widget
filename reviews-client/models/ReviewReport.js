// src/models/ReviewReport.js
import BaseModel from './BaseModel.js';
import Review from "@/models/Review";
import User from "@/models/User";

export default class ReviewReport extends BaseModel {
    static tableName = 'review_reports';

    static jsonSchema = {
        type: 'object',
        required: ['review_id','reason'],
        properties: {
            id:        { type: 'integer' },
            review_id: { type: 'integer' },
            user_id:   { type: ['integer','null'] },
            reason:    { type: 'string', enum: ['spam','offensive','false','other'] },
            comment:   { type: ['string','null'] },
        },
    };

    static relationMappings = () => ({
        reportedReview: { relation: BaseModel.BelongsToOneRelation,
            modelClass: Review,
            join: { from: 'review_reports.review_id', to: 'reviews.id' } },
        user:   { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'review_reports.user_id', to: 'users.id' } },
    });
}
