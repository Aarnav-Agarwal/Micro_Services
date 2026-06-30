import { Pool } from 'pg';

const pool = new Pool({
    host: 'localhost',     //auth-db in place of localhost as it is the container name of pg
    user: 'postgres',
    port: 5432,
    password: 'admin123',
    database: 'auth service'
});

pool.connect()
    .then(async () => {
        console.log('PostgreSQL Connected');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("user table ready");
    })
    .catch((err) => {
        console.error('Database Connection Error:', err);
    });

export default pool;