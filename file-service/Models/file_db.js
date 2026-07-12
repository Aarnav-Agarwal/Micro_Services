import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    password: process.env.DB_PASSWORD || 'secret123',
    database: process.env.DB_NAME || 'file_db'
});

pool.connect()
    .then(async () => {
        console.log("PostgreSQL Connected");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS files (
            id SERIAL PRIMARY KEY,
            owner_id INTEGER NOT NULL,
            original_name VARCHAR(255) NOT NULL,
            object_key TEXT NOT NULL,
            size_bytes BIGINT NOT NULL,
            mime_type VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("files table ready");
    })
    .catch((err) => {
        console.error("Database Connection Error:", err);
    });

export default pool;
