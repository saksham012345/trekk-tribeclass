import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import authRoutes from '../services/api/src/routes/auth';
import tripRoutes from '../services/api/src/routes/trips';
import reviewRoutes from '../services/api/src/routes/reviews';
import wishlistRoutes from '../services/api/src/routes/wishlist';
import fileRoutes from '../services/api/src/routes/files';
import notificationRoutes from '../services/api/src/routes/notifications';
import { notificationService } from '../services/api/src/utils/notificationService';
import jwt from 'jsonwebtoken';

const app = express();

// Enhanced error handling middleware
const asyncErrorHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Request timeout middleware
const timeoutMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(25000); // 25 seconds timeout for Vercel
  res.setTimeout(25000);
  next();
};

// Apply middleware
app.use(timeoutMiddleware);
app.use(helmet());
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' ? 
    [process.env.FRONTEND_URL || 'https://trekk-tribe.vercel.app'] : '*',
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session configuration for Vercel
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trekktribe',
    touchAfter: 24 * 3600
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

// Global error handler
const globalErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('🚨 Unhandled error:', error);
  
  if (res.headersSent) {
    return next(error);
  }
  
  const statusCode = (error as any).statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
};

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trekktribe';

// Database connection
const connectToDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });
      console.log('✅ Connected to MongoDB successfully');
    }
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    throw new Error(`Failed to connect to database: ${error.message}`);
  }
};

// Initialize database connection
connectToDatabase().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', asyncErrorHandler(async (_req: Request, res: Response) => {
  const mongoStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: {
      status: statusMap[mongoStatus as keyof typeof statusMap]
    },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  };
  
  res.json(health);
}));

// 404 handler
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'API route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Apply global error handler
app.use(globalErrorHandler);

// Export for Vercel serverless function
export default app;
