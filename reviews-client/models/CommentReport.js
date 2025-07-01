// src/models/CommentReport.js
import BaseModel from './BaseModel.js';
import ReviewComment from "@/models/ReviewComment";
import User from "@/models/User";

export default class CommentReport extends BaseModel {
    static tableName = 'comment_reports';

    static jsonSchema = {
        type: 'object',
        required: ['comment_id','reason'],
        properties: {
            id:         { type: 'integer' },
            comment_id: { type: 'integer' },
            user_id:    { type: ['integer','null'] },
            reason:     { type: 'string', enum: ['spam','offensive','false','other'] },
            comment:    { type: ['string','null'] },
        },
    };

    static relationMappings = () => ({
        reportedComment: { relation: BaseModel.BelongsToOneRelation,
            modelClass: ReviewComment,
            join: { from: 'comment_reports.comment_id', to: 'review_comments.id' } },
        user:    { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'comment_reports.user_id', to: 'users.id' } },
    });
}
