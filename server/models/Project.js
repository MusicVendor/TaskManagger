const {query} = require('../config/db');

async function buildSchemaProjects() {
    const queryText = `CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )`;
    try {
        const res = await query(queryText);
        console.log('Projects table created successfully', res);
    }
    catch (err) {
        console.error('Error creating projects table:', err);
    }
}

module.exports = { buildSchemaProjects};