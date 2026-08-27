const {query} = require('../config/db');


async function buildSchemaUsers() {
    const queryText = `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        refresh_token TEXT
    )`;
    try {
        const res = await query(queryText);
        console.log('Users table created successfully', res);
    }
    catch (err) {
        console.error('Error creating users table:', err);
    }
}

module.exports = { buildSchemaUsers};