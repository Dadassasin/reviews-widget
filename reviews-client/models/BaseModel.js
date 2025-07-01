// src/models/BaseModel.js
import { Model } from 'objection';
import { knex }  from '@/db/connection.js';

// Привязываем один инстанс knex ко всем моделям
Model.knex(knex);

export default class BaseModel extends Model {
    $beforeInsert() {
        if (!this.created_at) {
            this.created_at = new Date().toISOString();
        }
    }
}
