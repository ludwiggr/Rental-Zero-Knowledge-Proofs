const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Customer = require('../models/Customer');

describe('Bank Server', () => {
    let token;
    let testCustomerId;

    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(process.env.MONGODB_URI_TEST);
        
        // Generate test token
        token = jwt.sign({ id: 'test-user' }, process.env.JWT_SECRET);
        
        // Create test customer
        testCustomerId = 'test-customer-123';
        await Customer.create({
            customerId: testCustomerId,
            attestations: []
        });
    });

    afterAll(async () => {
        // Clean up test database
        await Customer.deleteMany({});
        await mongoose.connection.close();
    });

    describe('GET /public-info', () => {
        it('should return circuit and verification key', async () => {
            const res = await request(app)
                .get('/public-info')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('circuit');
            expect(res.body).toHaveProperty('verificationKey');
        });
    });

    describe('POST /attest-credit-score', () => {
        it('should create credit score attestation', async () => {
            const res = await request(app)
                .post('/attest-credit-score')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    customerId: testCustomerId,
                    creditScore: 740
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('attestation');
            expect(res.body).toHaveProperty('signature');
            expect(res.body.attestation.value).toBe(740);
        });

        it('should return 400 for missing fields', async () => {
            const res = await request(app)
                .post('/attest-credit-score')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    customerId: testCustomerId
                });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /verify-attestation', () => {
        it('should verify valid attestation', async () => {
            const attestation = {
                type: 'credit_score',
                value: 740,
                timestamp: Date.now(),
                customerId: testCustomerId
            };

            const signature = 'test-signature';

            const res = await request(app)
                .post('/verify-attestation')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    attestation,
                    signature
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('isValid');
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app)
                .post('/verify-attestation')
                .send({
                    attestation: {},
                    signature: 'test'
                });

            expect(res.status).toBe(401);
        });
    });
}); 