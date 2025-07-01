// src/models/Review.js
import BaseModel from './BaseModel.js';
import Widget from "@/models/Widget";
import User from "@/models/User";
import ReviewMedia from "@/models/ReviewMedia";
import ReviewReaction from "@/models/ReviewReaction";
import ReviewComment from "@/models/ReviewComment";
import ReviewReport from "@/models/ReviewReport";

export default class Review extends BaseModel {
    static tableName = 'reviews';

    static jsonSchema = {
        type: 'object',
        required: ['widget_id', 'rating', 'text'],
        properties: {
            id:         { type: 'integer' },
            widget_id:  { type: 'integer' },
            author_id:  { type: ['integer','null'] },
            rating:     { type: 'integer', minimum: 1, maximum: 5 },
            text:       { type: 'string' },
            sentiment:  { type: ['string','null'] },
            emotion:    { type: ['string','null'] },
        },
    };

    static relationMappings = () => ({
        widget: { relation: BaseModel.BelongsToOneRelation,
            modelClass: Widget,
            join: { from: 'reviews.widget_id', to: 'widgets.id' } },

        author: { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'reviews.author_id', to: 'users.id' } },

        media:  { relation: BaseModel.HasManyRelation,
            modelClass: ReviewMedia,
            join: { from: 'reviews.id', to: 'review_media.review_id' } },

        reactions: { relation: BaseModel.HasManyRelation,
            modelClass: ReviewReaction,
            join: { from: 'reviews.id', to: 'review_reactions.review_id' } },

        comments: { relation: BaseModel.HasManyRelation,
            modelClass: ReviewComment,
            join: { from: 'reviews.id', to: 'review_comments.review_id' } },

        reports: { relation: BaseModel.HasManyRelation,
            modelClass: ReviewReport,
            join: { from: 'reviews.id', to: 'review_reports.review_id' } },
    });
}
