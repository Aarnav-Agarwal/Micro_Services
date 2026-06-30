import { Pool } from "pg";

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "admin123",
    database: "file service",
});

pool.connect()
    .then(async () => {
        console.log("PostgreSQL Connected");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS files (
            id SERIAL PRIMARY KEY,
            owner_id INTEGER NOT NULL,
            original_name VARCHAR(255) NOT NULL,
            stored_path TEXT NOT NULL,
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
