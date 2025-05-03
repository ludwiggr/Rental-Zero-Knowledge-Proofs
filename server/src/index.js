import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { config } from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import proofRoutes from './routes/proofs.js';

// Load environment variables
config();

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

// Create Fastify instance
const fastify = Fastify({
  logger: true,
  ignoreTrailingSlash: true
});

// Register plugins
fastify.register(cors, {
  origin: true,
  credentials: true
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
});

// Add authentication hook
fastify.addHook('onRequest', async (request, reply) => {
  try {
    if (request.routeOptions?.url === '/api/auth/register' || 
        request.routeOptions?.url === '/api/auth/login') {
      return;
    }
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(proofRoutes, { prefix: '/api/proofs' });

// Health check route
fastify.get('/health', async () => {
  return { status: 'ok' };
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(error.statusCode || 500).send({
    error: error.message || 'Internal Server Error'
  });
});

// Start server
const start = async () => {
  try {
    await connectDB();
    await fastify.listen({ 
      port: PORT,
      host: HOST
    });
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 