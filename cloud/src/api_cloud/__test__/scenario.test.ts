import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';
import pool from '../app/config/db.config';
import Query, { processData } from './testTools'

const request = supertest(app);

describe('Scenario controller', () => {
    afterEach(async () => {
        await processData(Query.DELETE_SCENARIOS)
    });

    afterAll(async () => {
        await pool.end()
    });

    describe('createScenario', () => {
        test('should create a new scenario', async () => {
            const response = await request
                .post('/scenario')
                .expect('Content-Type', /json/)
                .send({
                    name: 'Test scenario'
                });

            expect(response.statusCode).toBe(HttpStatus.CREATED.code);
            expect(response.body.httpStatus).toBe(HttpStatus.CREATED.status);
        });

        test('should return an error when the body field is invalid', async () => {
            const response = await request
                .post('/scenario')
                .expect('Content-Type', /json/)
                .send({
                    invalidField: 'Test scenario',
                    device_id: '123'
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });

        test('should return an error when the body field type is invalid', async () => {
            const response = await request
                .post('/scenario')
                .expect('Content-Type', /json/)
                .send({
                    name: 1,
                    device_id: '123'
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });
    });

    describe('getScenario/:id', () => {
        test('should get a scenario with an id', async () => {
            await processData(Query.CREATE_SCENARIO)
            const response = await request.get('/scenario/123');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.scenarios).toBeDefined();
        });

        test('should return an error when getAll with invalid id', async () => {
            const response2 = await request.get('/scenario/321');

            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('getScenarios', () => {
        test('should return a list of scenarios', async () => {
            await processData(Query.CREATE_SCENARIO)
            const response = await request.get('/scenario');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.scenarios).toBeDefined();
        });
    });

    describe('deleteScenario/:id', () => {
        test('should delete the scenario', async () => {
            await processData(Query.CREATE_SCENARIO)
            const response = await request.delete('/scenario/123');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when delete with invalid id ', async () => {
            const response2 = await request.delete('/scenario/321');
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('updateScenario/:id', () => {
        test('should update the scenario', async () => {
            await processData(Query.CREATE_SCENARIO)
            const response = await request.put('/scenario/123').send({
                name: "TestUpdate"
            });
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when update with invalid id ', async () => {
            const response2 = await request.put('/scenario/321');
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

});