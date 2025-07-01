// src/models/ReviewComment.js
import BaseModel from './BaseModel.js';
import Review from "@/models/Review";
import User from "@/models/User";
import CommentReaction from "@/models/CommentReaction";
import CommentReport from "@/models/CommentReport";

export default class ReviewComment extends BaseModel {
    static tableName = 'review_comments';

    static jsonSchema = {
        type: 'object',
        required: ['review_id','text'],
        properties: {
            id:        { type: 'integer' },
            review_id: { type: 'integer' },
            author_id: { type: ['integer','null'] },
            text:      { type: 'string' },
        },
    };

    static relationMappings = () => ({
        review: { relation: BaseModel.BelongsToOneRelation,
            modelClass: Review,
            join: { from: 'review_comments.review_id', to: 'reviews.id' } },
        author: { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'review_comments.author_id', to: 'users.id' } },
        reactions: { relation: BaseModel.HasManyRelation,
            modelClass: CommentReaction,
            join: { from: 'review_comments.id', to: 'comment_reactions.comment_id' } },
        reports: { relation: BaseModel.HasManyRelation,
            modelClass: CommentReport,
            join: { from: 'review_comments.id', to: 'comment_reports.comment_id' } },
    });
}
