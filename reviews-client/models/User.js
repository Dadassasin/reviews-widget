// src/models/User.js
import BaseModel from './BaseModel.js';
import Widget    from "@/models/Widget";

export default class User extends BaseModel {
    static tableName = 'users';

    static jsonSchema = {
        type: 'object',
        required: ['name', 'email', 'password'],  // name остаётся обязательным
        properties: {
            id:          { type: 'integer' },
            name:        { type: 'string', minLength: 1, maxLength: 255 }, // никнейм
            first_name: { type: 'string', minLength:1, maxLength:255 },
            last_name:  { type: 'string', minLength:1, maxLength:255 },
            email:       { type: 'string', format: 'email' },
            password:    { type: 'string' },
            avatar_url:  { type: ['string','null'] },
            created_at:  { type: 'string', format: 'date-time' },
        },
    };

    $formatJson(json) {
        json = super.$formatJson(json);
        delete json.password;
        return json;
    }

    static relationMappings = () => ({
        widgets: { relation: BaseModel.HasManyRelation,
            modelClass: Widget,
            join: { from: 'users.id', to: 'widgets.owner_id' } },
    });
}
