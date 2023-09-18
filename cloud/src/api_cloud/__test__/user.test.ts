import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';
import pool from '../app/config/db.config';
import Query, { processData } from './testTools'
import jwt from 'jsonwebtoken';
const secretKey = process.env.SECRET_KEY || "secret_key"
let token = "";
const request = supertest(app);

describe('User controller', () => {
    beforeAll(async () => {
        token = jwt.sign({
            id: "fix-id-token",
            email: "fix-email-token",
            isadmin: "fix-admin-token"
        }, secretKey, { expiresIn: '3 hours' })
    })

    afterEach(async () => {
        await processData(Query.DELETE_USERS)
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('createUser', () => {
        test('should create a new user', async () => {
            const response = await request
                .post('/user')
                .expect('Content-Type', /json/)
                .send({
                    name: 'Test user',
                    forename: 'Test user',
                    email: 'test@test.com',
                    password: 'test',
                    is_admin: true,
                });

            expect(response.statusCode).toBe(HttpStatus.CREATED.code);
            expect(response.body.httpStatus).toBe(HttpStatus.CREATED.status);
        });

        test('should return an error when the body field is invalid', async () => {
            const response = await request
                .post('/user')
                .expect('Content-Type', /json/)
                .send({
                    invalidField: 'Test',
                    forename: 'Test user',
                    email: 'test@test',
                    password: 'test',
                    is_admin: true
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });

        test('should return an error when the body field type is invalid', async () => {
            const response = await request
                .post('/user')
                .expect('Content-Type', /json/)
                .send({
                    name: 1,
                    forename: 'Test user',
                    email: 'test@test',
                    password: 'test',
                    is_admin: true,
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });
    });

    describe('getUser/:id', () => {
        test('should get a user with an id', async () => {
            await processData(Query.CREATE_USER);
            const response = await request.get('/user/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.users).toBeDefined();
        });

        test('should return an error when getAll with invalid id', async () => {
            const response2 = await request.get('/user/321').set('Authorization', `${token}`);

            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('getUsers', () => {
        test('should return a list of users', async () => {
            await processData(Query.CREATE_USER);
            const response = await request.get('/user').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.users).toBeDefined();
        });
    });

    describe('deleteUser/:id', () => {
        test('should delete the user', async () => {
            await processData(Query.CREATE_USER);
            const response = await request.delete('/user/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when delete with invalid id ', async () => {
            const response2 = await request.delete('/user/321').set('Authorization', `${token}`);
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('updateUser/:id', () => {
        test('should update the user', async () => {
            await processData(Query.CREATE_USER);
            const response = await request
            .put('/user/123')
            .set('Authorization', `${token}`)
            .send({
                name: "TestUpdate"
            });
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when update with invalid id ', async () => {
            const response2 = await request.put('/user/321').set('Authorization', `${token}`);
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });
});
