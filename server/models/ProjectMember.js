const {query} = require('../config/db');

async function buildSchemaProjectMembers() {
    const queryText = `CREATE TABLE IF NOT EXISTS project_members(
        project_id INT REFERENCES projects(id),
        user_id INT REFERENCES users(id)
    )`;

    try {
        const res = await query(queryText);
        console.log('ProjectMembers table created successfully', res);
    } catch (err) {
        console.error('Error creating project_members table:', err);
    }
}

module.exports = { buildSchemaProjectMembers };