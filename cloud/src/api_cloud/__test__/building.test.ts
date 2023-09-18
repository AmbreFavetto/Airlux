import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';
import pool from '../app/config/db.config';
import Query, { processData } from './testTools'
import logger from '../app/util/logger'
import jwt from 'jsonwebtoken';
const request = supertest(app);
const secretKey = process.env.SECRET_KEY || "secret_key"
let token = "";

describe('Building controller', () => {
    afterEach(async () => {
        await processData(Query.DELETE_BUILDINGS)
    });

    afterAll(async () => {
        await pool.end();
    });

    beforeAll(async () => {
        // generate token
        token = jwt.sign({
            id: "fix-id-token",
            email: "fix-email-token",
            isadmin: "fix-admin-token"
          }, secretKey, { expiresIn: '3 hours' })

    });
    describe('createBuilding', () => {
        test('should create a new building', async () => {
            const response = await request
                .post('/building')
                .set('Authorization', `${token}`)
                .expect('Content-Type', /json/)
                .send({
                    name: 'Test building',
                });

            expect(response.statusCode).toBe(HttpStatus.CREATED.code);
            expect(response.body.httpStatus).toBe(HttpStatus.CREATED.status);
        });

        test('should return an error when the body field is invalid', async () => {
            const response = await request
                .post('/building')
                .set('Authorization', `${token}`)
                .expect('Content-Type', /json/)
                .send({
                    invalidField: 'Test',
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });

        test('should return an error when the body field type is invalid', async () => {
            const response = await request
                .post('/building')
                .set('Authorization', `${token}`)
                .expect('Content-Type', /json/)
                .send({
                    name: 1,
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });
    });

    describe('getBuilding/:id', () => {
        test('should get a building with an id', async () => {
            await processData(Query.CREATE_BUILDING);
            const response = await request.get('/building/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.buildings).toBeDefined();
        });

        test('should return an error when getAll with invalid id', async () => {
            const response2 = await request.get('/building/321').set('Authorization', `${token}`);

            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('getBuildings', () => {
        test('should return a list of buildings', async () => {
            await processData(Query.CREATE_BUILDING);
            const response = await request.get('/building').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.buildings).toBeDefined();
        });
    });

    describe('deleteBuilding/:id', () => {
        test('should delete the building', async () => {
            await processData(Query.CREATE_BUILDING);
            const response = await request.delete('/building/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when delete with invalid id ', async () => {
            const response2 = await request.delete('/building/321').set('Authorization', `${token}`);
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('updateBuilding/:id', () => {
        test('should update the building', async () => {
            await processData(Query.CREATE_BUILDING);
            const response = await request
            .put('/building/123')
            .set('Authorization', `${token}`)
            .send({
                name: "TestUpdate"
            });
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when update with invalid id ', async () => {
            const response2 = await request.put('/building/321').set('Authorization', `${token}`);
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });
});
