const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Employee = require('../models/Employee');

describe('Employer Server', () => {
    let token;
    let testEmployeeId;

    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(process.env.MONGODB_URI_TEST);
        
        // Generate test token
        token = jwt.sign({ id: 'test-user' }, process.env.JWT_SECRET);
        
        // Create test employee
        testEmployeeId = 'test-employee-123';
        await Employee.create({
            employeeId: testEmployeeId,
            attestations: []
        });
    });

    afterAll(async () => {
        // Clean up test database
        await Employee.deleteMany({});
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

    describe('POST /attest-income', () => {
        it('should create income attestation', async () => {
            const res = await request(app)
                .post('/attest-income')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    employeeId: testEmployeeId,
                    income: 3500
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('attestation');
            expect(res.body).toHaveProperty('signature');
            expect(res.body.attestation.value).toBe(3500);
        });

        it('should return 400 for missing fields', async () => {
            const res = await request(app)
                .post('/attest-income')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    employeeId: testEmployeeId
                });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /verify-attestation', () => {
        it('should verify valid attestation', async () => {
            const attestation = {
                type: 'income',
                value: 3500,
                currency: 'EUR',
                timestamp: Date.now(),
                employeeId: testEmployeeId
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