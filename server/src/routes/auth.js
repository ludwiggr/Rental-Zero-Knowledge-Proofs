import { FastifyInstance } from 'fastify';
import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/auth.js';

const registerSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'password', 'role'],
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      role: { type: 'string', enum: ['tenant', 'landlord'] }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' }
          }
        }
      }
    }
  }
};

const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' }
          }
        }
      }
    }
  }
};

export default async function authRoutes(fastify: FastifyInstance) {
  // Register new user
  fastify.post('/register', {
    schema: registerSchema,
    handler: async (request, reply) => {
      const { name, email, password, role } = request.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw fastify.httpErrors.badRequest('Email already registered');
      }

      // Create new user
      const hashedPassword = await hashPassword(password);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
      });

      // Generate JWT token
      const token = fastify.jwt.sign({ id: user._id, role: user.role });

      reply.code(201).send({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
  });

  // Login user
  fastify.post('/login', {
    schema: loginSchema,
    handler: async (request, reply) => {
      const { email, password } = request.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw fastify.httpErrors.unauthorized('Invalid credentials');
      }

      // Verify password
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        throw fastify.httpErrors.unauthorized('Invalid credentials');
      }

      // Generate JWT token
      const token = fastify.jwt.sign({ id: user._id, role: user.role });

      reply.send({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
  });

  // Get current user profile
  fastify.get('/me', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const user = await User.findById(request.user.id).select('-password');
      if (!user) {
        throw fastify.httpErrors.notFound('User not found');
      }
      reply.send(user);
    }
  });
} 