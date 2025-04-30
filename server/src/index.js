import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import proofRoutes from './routes/proofs.js';

dotenv.config();

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-zkp';

// Create Fastify instance with logger
const app = Fastify({
  logger: true
});

// Register plugins
app.register(cors, {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
});

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => app.log.info('Connected to MongoDB'))
  .catch(err => app.log.error('MongoDB connection error:', err));

// Register routes
app.register(authRoutes, { prefix: '/api/auth' });
app.register(proofRoutes, { prefix: '/api/proofs' });

// Health check route
app.get('/health', async () => {
  return { status: 'ok' };
});

// Error handler
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(error.statusCode || 500).send({
    error: error.message || 'Internal Server Error'
  });
});

// Start server
const start = async () => {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    app.log.info(`Server is running on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start(); 