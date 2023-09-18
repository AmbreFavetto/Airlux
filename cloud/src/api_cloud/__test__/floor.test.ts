import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';
import pool from '../app/config/db.config';
import Query, { processData } from './testTools'
import jwt from 'jsonwebtoken';
const secretKey = process.env.SECRET_KEY || "secret_key"
let token = "";
const request = supertest(app);

describe('Floor controller', () => {
    beforeAll(async () => {
        await processData(Query.CREATE_BUILDING)
        token = jwt.sign({
            id: "fix-id-token",
            email: "fix-email-token",
            isadmin: "fix-admin-token"
        }, secretKey, { expiresIn: '3 hours' })
    });

    afterEach(async () => {
        await processData(Query.DELETE_FLOORS)
    });

    afterAll(async () => {
        await processData(Query.DELETE_BUILDINGS)
        await pool.end()
    });

    describe('createFloor', () => {
        test('should create a new floor', async () => {
            const response = await request
                .post('/floor')
                .set('Authorization', `${token}`)
                .expect('Content-Type', /json/)
                .send({
                    name: 'Test floor',
                    building_id: '123'
                });

            expect(response.statusCode).toBe(HttpStatus.CREATED.code);
            expect(response.body.httpStatus).toBe(HttpStatus.CREATED.status);
        });

        test('should return an error when the body field is invalid', async () => {
            const response = await request
                .post('/floor')
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
                .post('/floor')
                .set('Authorization', `${token}`)
                .expect('Content-Type', /json/)
                .send({
                    name: 1,
                    building_id: '123'
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });
    });

    describe('getFloor/:id', () => {
        test('should get a floor with an id', async () => {
            await processData(Query.CREATE_FLOOR)
            const response = await request.get('/floor/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.floors).toBeDefined();
        });

        test('should return an error when getAll with invalid id', async () => {
            const response2 = await request.get('/floor/321').set('Authorization', `${token}`);

            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('getFloors', () => {
        test('should return a list of floors', async () => {
            await processData(Query.CREATE_FLOOR)
            const response = await request.get('/floor').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.floors).toBeDefined();
        });
    });

    describe('deleteFloor/:id', () => {
        test('should delete the floor', async () => {
            await processData(Query.CREATE_FLOOR)
            const response = await request.delete('/floor/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when delete with invalid id ', async () => {
            const response2 = await request.delete('/floor/321').set('Authorization', `${token}`);
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('updateFloor/:id', () => {
        test('should update the floor', async () => {
            await processData(Query.CREATE_FLOOR)
            const response = await request
            .put('/floor/123')
            .set('Authorization', `${token}`)
            .send({
                name: "TestUpdate"
            });
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when update with invalid id ', async () => {
            const response2 = await request.put('/floor/321').set('Authorization', `${token}`);
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

});