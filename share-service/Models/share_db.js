import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    password: process.env.DB_PASSWORD || 'secret123',
    database: process.env.DB_NAME || 'share_db'
});

pool.connect()
    .then(async() => {
        console.log('PostgreSQL Connected');
        await pool.query(`CREATE TABLE IF NOT EXISTS shares (
                        id SERIAL PRIMARY KEY,
                        file_id INTEGER NOT NULL,
                        owner_id INTEGER NOT NULL,
                        shared_with_user_id INTEGER NULL,
                        public_token TEXT NULL,
                        expires_at TIMESTAMP NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE(file_id, shared_with_user_id)
                        )
                    `);
        console.log("table ready");
    })
    .catch((err) => {
        console.error('Database Connection Error:', err);
    });

export default pool;
