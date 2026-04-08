import { Pool } from 'pg';
import { logger } from '../utils/logger';

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    logger.info('Connected to PostgreSQL database successfully.');
    // Optional: test query
    const res = await client.query('SELECT NOW()');
    logger.info(`DB Time: ${res.rows[0].now}`);
    client.release();
  } catch (error) {
    logger.error(`Error connecting to database: ${(error as Error).message}`);
    process.exit(1);
  }
};
