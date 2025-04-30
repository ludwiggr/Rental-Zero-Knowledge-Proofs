import { FastifyInstance } from 'fastify';
import { verifyProof } from '../utils/proofs.js';

const proofSchema = {
  body: {
    type: 'object',
    required: ['proof', 'publicSignals'],
    properties: {
      proof: {
        type: 'object',
        required: ['pi_a', 'pi_b', 'pi_c', 'protocol'],
        properties: {
          pi_a: { type: 'array', items: { type: 'string' } },
          pi_b: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
          pi_c: { type: 'array', items: { type: 'string' } },
          protocol: { type: 'string', enum: ['groth16'] }
        }
      },
      publicSignals: { type: 'array', items: { type: 'string' } }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        verified: { type: 'boolean' }
      }
    }
  }
};

export default async function proofRoutes(fastify) {
  // Verify income proof
  fastify.post('/verify/income', {
    schema: proofSchema,
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const { proof, publicSignals } = request.body;
        const verified = await verifyProof('incomeVerification', proof, publicSignals);
        reply.send({ verified });
      } catch (error) {
        throw fastify.httpErrors.badRequest('Invalid proof format');
      }
    }
  });

  // Verify rental history proof
  fastify.post('/verify/rental-history', {
    schema: proofSchema,
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const { proof, publicSignals } = request.body;
        const verified = await verifyProof('rentalHistory', proof, publicSignals);
        reply.send({ verified });
      } catch (error) {
        throw fastify.httpErrors.badRequest('Invalid proof format');
      }
    }
  });
} 