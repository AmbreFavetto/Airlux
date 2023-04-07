import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';
import pool from '../app/config/db.config';
import Query, { processData } from './testTools'

const request = supertest(app);

describe('SousScenario controller', () => {
    beforeAll(async () => {
        await processData(Query.CREATE_BUILDING)
        await processData(Query.CREATE_FLOOR)
        await processData(Query.CREATE_ROOM)
        await processData(Query.CREATE_DEVICE)
    })
    afterEach(async () => {
        await processData(Query.DELETE_SOUS_SCENARIOS)
    });

    afterAll(async () => {
        await processData(Query.DELETE_BUILDINGS)
        await pool.end()
    });

    describe('createSousScenario', () => {
        test('should create a new sousScenario', async () => {
            const response = await request
                .post('/sous-scenario')
                .expect('Content-Type', /json/)
                .send({
                    device_id: '123',
                    action: "on"
                });

            expect(response.statusCode).toBe(HttpStatus.CREATED.code);
            expect(response.body.httpStatus).toBe(HttpStatus.CREATED.status);
        });

        test('should return an error when the body field is invalid', async () => {
            const response = await request
                .post('/sous-scenario')
                .expect('Content-Type', /json/)
                .send({
                    invalidField: 'Test sousScenario',
                    action: "on"
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });

        test('should return an error when the body field type is invalid', async () => {
            const response = await request
                .post('/sous-scenario')
                .expect('Content-Type', /json/)
                .send({
                    device_id: 1,
                    action: 'on'
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });
    });

    describe('getSousScenario/:id', () => {
        test('should get a sousScenario with an id', async () => {
            await processData(Query.CREATE_SOUS_SCENARIO)
            const response = await request.get('/sous-scenario/123');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.sousScenarios).toBeDefined();
        });

        test('should return an error when getAll with invalid id', async () => {
            const response2 = await request.get('/sous-scenario/321');

            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('getSousScenarios', () => {
        test('should return a list of sousScenario', async () => {
            await processData(Query.CREATE_SOUS_SCENARIO)
            const response = await request.get('/sous-scenario');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.sousScenarios).toBeDefined();
        });
    });

    describe('deleteSousScenario/:id', () => {
        test('should delete the sousScenario', async () => {
            await processData(Query.CREATE_SOUS_SCENARIO)
            const response = await request.delete('/sous-scenario/123');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when delete with invalid id ', async () => {
            const response2 = await request.delete('/sous-scenario/321');
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('updateSousScenario/:id', () => {
        test('should update the sousScenario', async () => {
            await processData(Query.CREATE_SOUS_SCENARIO)
            const response = await request.put('/sous-scenario/123').send({
                action: "off"
            });
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when update with invalid id ', async () => {
            const response2 = await request.put('/sous-scenario/321');
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

});