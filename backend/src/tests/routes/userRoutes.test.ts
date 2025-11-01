import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index';

describe('User Routes', () => {
    describe('POST /api/users/register', () => {
        it('should register a new user', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userData)
                .expect(201);

            expect(response.body.message).toBe('User created successfully');
            expect(response.body.user.email).toBe(userData.email);
            expect(response.body.user.name).toBe(userData.name);
        });

        it('should return validation error for invalid email', async () => {
            const userData = {
                email: 'invalid-email',
                password: 'password123',
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userData)
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });

        it('should return validation error for short password', async () => {
            const userData = {
                email: 'test@example.com',
                password: '123',
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userData)
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });
    });

    describe('POST /api/users/login', () => {
        it('should login with valid credentials', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            // Register user first
            await request(app)
                .post('/api/users/register')
                .send(userData);

            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: userData.email,
                    password: userData.password,
                })
                .expect(200);

            expect(response.body.message).toBe('Login successful');
            expect(response.body.token).toBeDefined();
            expect(response.body.user.email).toBe(userData.email);
        });

        it('should return error for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                })
                .expect(401);

            expect(response.body.error).toBe('Invalid credentials');
        });
    });

    describe('GET /api/users/profile', () => {
        it('should return user profile with valid token', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            // Register and login
            await request(app)
                .post('/api/users/register')
                .send(userData);

            const loginResponse = await request(app)
                .post('/api/users/login')
                .send({
                    email: userData.email,
                    password: userData.password,
                });

            const token = loginResponse.body.token;

            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body.user.email).toBe(userData.email);
            expect(response.body.user.name).toBe(userData.name);
        });

        it('should return error without token', async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .expect(401);

            expect(response.body.error).toBe('Access denied. No token provided.');
        });

        it('should return error with invalid token', async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);

            expect(response.body.error).toBe('Invalid token.');
        });
    });
});