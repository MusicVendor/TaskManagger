const {query} = require('../config/db');

async function buildSchemaTasks() {
    const queryText = `DO $$ BEGIN
        CREATE TYPE status AS ENUM('to-do', 'in-progress', 'completed');
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END $$;
        CREATE TABLE IF NOT EXISTS tasks(
        id SERIAL PRIMARY KEY,
        created_by INT REFERENCES users(id),
        project_id INT REFERENCES projects(id) ON DELETE CASCADE,
        user_assigned INT[] DEFAULT '{}',
        task_name VARCHAR(255) NOT NULL,
        task_description TEXT,
        task_status status DEFAULT 'to-do',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP
    )`;

    try {
        const res = await query(queryText);
        console.log('Tasks table created successfully', res);
    } catch (err) {
        console.error('Error creating tasks table:', err);
    }
}

module.exports = { buildSchemaTasks };