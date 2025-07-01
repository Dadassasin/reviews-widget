// knexfile.js
require('dotenv').config({ path: './.env.local' })
console.log('▶ Connecting to:', process.env.DATABASE_URL)


module.exports = {
    development: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './migrations'
        },
        pool: {
            min: 2,
            max: 10,
            acquireTimeoutMillis: 30000,
            idleTimeoutMillis: 30000
        }
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './migrations'
        },
        pool: {
            min: 2,
            max: 10,
            acquireTimeoutMillis: 30000,
            idleTimeoutMillis: 30000
        }
    }
};
