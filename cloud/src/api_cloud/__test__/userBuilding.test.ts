import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';
import pool from '../app/config/db.config';
import Query, { processData } from './testTools'

const request = supertest(app);

describe('UserBuilding controller', () => {
    beforeAll(async () => {
        await processData(Query.CREATE_BUILDING)
        await processData(Query.CREATE_USER)
    });
    afterEach(async () => {
        await processData(Query.DELETE_USER_BUILDINGS)
    });

    afterAll(async () => {
        await processData(Query.DELETE_BUILDINGS)
        await processData(Query.DELETE_USERS)
        await pool.end();
    });

    describe('createUserBuilding', () => {
        test('should create a new userBuilding', async () => {
            const response = await request
                .post('/user-building')
                .expect('Content-Type', /json/)
                .send({
                    user_id: '123',
                    building_id: '123',
                });

            expect(response.statusCode).toBe(HttpStatus.CREATED.code);
            expect(response.body.httpStatus).toBe(HttpStatus.CREATED.status);
        });

        test('should return an error when the body field is invalid', async () => {
            const response = await request
                .post('/user-building')
                .expect('Content-Type', /json/)
                .send({
                    invalidField: '123',
                    building_id: '123',
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });

        test('should return an error when the body field type is invalid', async () => {
            const response = await request
                .post('/user-building')
                .expect('Content-Type', /json/)
                .send({
                    user_id: 1,
                    building_id: '123',
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });
    });

    describe('getUserBuilding/:id', () => {
        test('should get a userBuilding with an id', async () => {
            await processData(Query.CREATE_USER_BUILDING);
            const response = await request.get('/user-building/123');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.usersBuildings).toBeDefined();
        });

        test('should return an error when getAll with invalid id', async () => {
            const response2 = await request.get('/user-building/321');
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('getUsersBuildings', () => {
        test('should return a list of usersBuildings', async () => {
            await processData(Query.CREATE_USER_BUILDING);
            const response = await request.get('/user-building');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.usersBuildings).toBeDefined();
        });
    });

    describe('deleteUserBuilding/:id', () => {
        test('should delete the userBuilding', async () => {
            await processData(Query.CREATE_USER_BUILDING);
            const response = await request.delete('/user-building/123');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when delete with invalid id ', async () => {
            const response2 = await request.delete('/user-building/321');
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('updateUserBuilding/:id', () => {
        test('should update the userBuilding', async () => {
            await processData(Query.CREATE_USER_BUILDING);
            await processData(Query.CREATE_OTHER_BUILDING);
            const response = await request.put('/user-building/123').send({
                building_id: "234"
            });
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when update with invalid id ', async () => {
            const response2 = await request.put('/user-building/321');
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });
});
