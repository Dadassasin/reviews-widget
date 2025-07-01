// src/db/connection.js
import 'dotenv/config';
import Knex from 'knex';

const config = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 30000,  // ждём до 30 сек, пока найдётся свободное соединение
        idleTimeoutMillis:    30000,  // не держим соединение бездействующим дольше 30 сек
    }
};

if (!globalThis.__knex) {
    globalThis.__knex = Knex(config);
}

export const knex = globalThis.__knex;
