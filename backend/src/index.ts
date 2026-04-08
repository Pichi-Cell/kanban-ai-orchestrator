import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connection';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/error.middleware';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3001;

// Built-in middleware for parsing JSON and cors
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);

// Generic Error Handler Middleware
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

startServer();
