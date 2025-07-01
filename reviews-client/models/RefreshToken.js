// src/models/RefreshToken.js
import BaseModel from './BaseModel.js';
import User from "@/models/User";

export default class RefreshToken extends BaseModel {
    static tableName = 'refresh_tokens';

    static jsonSchema = {
        type: 'object',
        required: ['user_id'],
        properties: {
            id:         { type: 'integer' },
            user_id:    { type: 'integer' },
            token:      { type: 'string', format: 'uuid' },
            revoked:    { type: 'boolean' },
            expires_at: { type: 'string', format: 'date-time' },
        },
    };

    static relationMappings = () => ({
        user: { relation: BaseModel.BelongsToOneRelation,
            modelClass: User,
            join: { from: 'refresh_tokens.user_id', to: 'users.id' } },
    });
}
