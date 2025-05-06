import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {build} from '../../server/src/app.js';
import {connectDB, closeDB} from '../../server/src/config/database.js';
import User from '../../server/src/models/User.js';

let app;

beforeAll(async () => {
    await connectDB();
    // Clean up any existing test users
    await User.deleteMany({email: /test@example.com$/});
    // Build Fastify app
    app = await build();
});

afterAll(async () => {
    await closeDB();
    await app.close();
});

describe('Authentication Endpoints', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'tenant'
            };

            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: userData
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('token');
            expect(body.user).toHaveProperty('email', userData.email);
            expect(body.user).not.toHaveProperty('password');
        });

        it('should reject registration with existing email', async () => {
            const userData = {
                name: 'Another Test User',
                email: 'test@example.com',
                password: 'password456',
                role: 'tenant'
            };

            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: userData
            });

            expect(response.statusCode).toBe(400);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('error');
        });

        it('should reject registration with invalid data', async () => {
            const invalidData = {
                name: 'Test User',
                email: 'invalid-email',
                password: '123',
                role: 'invalid-role'
            };

            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: invalidData
            });

            expect(response.statusCode).toBe(400);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('error');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login user successfully', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/login',
                payload: loginData
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('token');
            expect(body.user).toHaveProperty('email', loginData.email);
            expect(body.user).not.toHaveProperty('password');
        });

        it('should reject login with wrong password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/login',
                payload: loginData
            });

            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('error');
        });

        it('should reject login with non-existent email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/login',
                payload: loginData
            });

            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('error');
        });
    });

    describe('GET /api/auth/me', () => {
        let authToken;

        beforeAll(async () => {
            // Login to get auth token
            const loginResponse = await app.inject({
                method: 'POST',
                url: '/api/auth/login',
                payload: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            });
            const body = JSON.parse(loginResponse.body);
            authToken = body.token;
        });

        it('should get current user profile', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/api/auth/me',
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('email', 'test@example.com');
            expect(body).not.toHaveProperty('password');
        });

        it('should reject request without authentication', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/api/auth/me'
            });

            expect(response.statusCode).toBe(401);
        });

        it('should reject request with invalid token', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/api/auth/me',
                headers: {
                    authorization: 'Bearer invalid-token'
                }
            });

            expect(response.statusCode).toBe(401);
        });
    });
}); 