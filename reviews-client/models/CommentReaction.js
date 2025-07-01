// src/models/CommentReaction.js
import BaseModel from './BaseModel.js';
import ReviewComment from "@/models/ReviewComment";
import User from "@/models/User";

export default class CommentReaction extends BaseModel {
    static tableName = 'comment_reactions';

    static jsonSchema = {
        type: 'object',
        required: ['comment_id','user_id','reaction'],
        properties: {
            id:         { type: 'integer' },
            comment_id: { type: 'integer' },
            user_id:    { type: 'integer' },
            reaction:   { type: 'string', enum: ['like','dislike'] },
        },
    };

    static relationMappings = () => ({
        comment: { relation: BaseModel.BelongsToOneRelation,
            modelClass: ReviewComment,
            join: { from: 'comment_reactions.comment_id', to: 'review_comments.id' } },
        user:    { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'comment_reactions.user_id', to: 'users.id' } },
    });
}
