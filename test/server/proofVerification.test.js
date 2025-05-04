import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {build} from '../../server/src/app.js';
import {connectDB, closeDB} from '../../server/src/config/database.js';
import {generateToken} from '../../server/src/utils/auth.js';

let app;
let authToken;

beforeAll(async () => {
    await connectDB();
    // Build Fastify app
    app = await build();
    // Create a test user and get auth token
    authToken = await generateToken({id: 'test-user-id', role: 'tenant'});
});

afterAll(async () => {
    await closeDB();
    await app.close();
});

describe('Proof Verification Endpoints', () => {
    describe('POST /api/proofs/verify/income', () => {
        it('should verify valid income proof', async () => {
            const validProof = {
                proof: {
                    pi_a: ['123', '456'],
                    pi_b: [['789', '012'], ['345', '678']],
                    pi_c: ['901', '234'],
                    protocol: 'groth16'
                },
                publicSignals: ['1']
            };

            const response = await app.inject({
                method: 'POST',
                url: '/api/proofs/verify/income',
                headers: {
                    authorization: `Bearer ${authToken}`
                },
                payload: validProof
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('verified', true);
        });

        it('should reject invalid income proof', async () => {
            const invalidProof = {
                proof: {
                    pi_a: ['000', '000'],
                    pi_b: [['000', '000'], ['000', '000']],
                    pi_c: ['000', '000'],
                    protocol: 'groth16'
                },
                publicSignals: ['0']
            };

            const response = await app.inject({
                method: 'POST',
                url: '/api/proofs/verify/income',
                headers: {
                    authorization: `Bearer ${authToken}`
                },
                payload: invalidProof
            });

            expect(response.statusCode).toBe(400);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('verified', false);
        });

        it('should reject request without authentication', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/proofs/verify/income',
                payload: {}
            });

            expect(response.statusCode).toBe(401);
        });
    });

    describe('POST /api/proofs/verify/rental-history', () => {
        it('should verify valid rental history proof', async () => {
            const validProof = {
                proof: {
                    pi_a: ['123', '456'],
                    pi_b: [['789', '012'], ['345', '678']],
                    pi_c: ['901', '234'],
                    protocol: 'groth16'
                },
                publicSignals: ['1']
            };

            const response = await app.inject({
                method: 'POST',
                url: '/api/proofs/verify/rental-history',
                headers: {
                    authorization: `Bearer ${authToken}`
                },
                payload: validProof
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('verified', true);
        });

        it('should reject invalid rental history proof', async () => {
            const invalidProof = {
                proof: {
                    pi_a: ['000', '000'],
                    pi_b: [['000', '000'], ['000', '000']],
                    pi_c: ['000', '000'],
                    protocol: 'groth16'
                },
                publicSignals: ['0']
            };

            const response = await app.inject({
                method: 'POST',
                url: '/api/proofs/verify/rental-history',
                headers: {
                    authorization: `Bearer ${authToken}`
                },
                payload: invalidProof
            });

            expect(response.statusCode).toBe(400);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('verified', false);
        });

        it('should reject malformed proof data', async () => {
            const malformedProof = {
                proof: {
                    pi_a: ['123'],
                    pi_b: [['789']],
                    pi_c: ['901']
                },
                publicSignals: ['1']
            };

            const response = await app.inject({
                method: 'POST',
                url: '/api/proofs/verify/rental-history',
                headers: {
                    authorization: `Bearer ${authToken}`
                },
                payload: malformedProof
            });

            expect(response.statusCode).toBe(400);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('error');
        });
    });
}); 