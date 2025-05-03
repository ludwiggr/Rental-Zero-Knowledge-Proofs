import { verifyIncomeProof, verifyRentalHistoryProof } from '../utils/proofs.js';

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
export default async function proofRoutes(fastify) {
  // Verify income proof
  fastify.post('/verify/income', {
    schema: {
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
              protocol: { type: 'string' }
            }
          },
          publicSignals: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    onRequest: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }]
  }, async (request, reply) => {
    try {
      const { proof, publicSignals } = request.body;
      const isValid = await verifyIncomeProof(proof, publicSignals);
      
      if (!isValid) {
        return reply.code(400).send({ error: 'Invalid proof' });
      }

      return reply.send({ verified: true });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  // Verify rental history proof
  fastify.post('/verify/rental-history', {
    schema: {
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
              protocol: { type: 'string' }
            }
          },
          publicSignals: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    onRequest: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }]
  }, async (request, reply) => {
    try {
      const { proof, publicSignals } = request.body;
      const isValid = await verifyRentalHistoryProof(proof, publicSignals);
      
      if (!isValid) {
        return reply.code(400).send({ error: 'Invalid proof' });
      }

      return reply.send({ verified: true });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Server error' });
    }
  });
} 