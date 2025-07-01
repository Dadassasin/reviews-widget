// src/models/ReviewMedia.js
import BaseModel from './BaseModel.js';
import Review from "@/models/Review";

export default class ReviewMedia extends BaseModel {
    static tableName = 'review_media';

    static jsonSchema = {
        type: 'object',
        required: ['review_id','url'],
        properties: {
            id:        { type: 'integer' },
            review_id: { type: 'integer' },
            url:       { type: 'string' },
        },
    };

    static relationMappings = () => ({
        review: { relation: BaseModel.BelongsToOneRelation,
            modelClass: Review,
            join: { from: 'review_media.review_id', to: 'reviews.id' } },
    });
}
