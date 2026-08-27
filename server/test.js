const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

(async () => {
    console.log('pg version:', require('pg/package.json').version);
    console.log('pool.query type:', typeof pool.query);

    const res = await pool.query('CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY)');
    console.log('Result:', res);
    console.log('rowCount:', res.rowCount);

    await pool.end();
})();