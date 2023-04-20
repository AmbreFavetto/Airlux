import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';
import pool from '../app/config/db.config';
import Query, { processData } from './testTools'

const request = supertest(app);

describe('Timeseries controller', () => {
    beforeAll(async () => {
        await processData(Query.CREATE_BUILDING)
        await processData(Query.CREATE_FLOOR)
        await processData(Query.CREATE_ROOM)
        await processData(Query.CREATE_DEVICE)
    })
    afterEach(async () => {
        await processData(Query.DELETE_TIMESERIESS)
    });

    afterAll(async () => {
        await processData(Query.DELETE_BUILDINGS)
        await pool.end()
    });

    describe('createTimeseries', () => {
        test('should create a new timeseries', async () => {
            const response = await request
                .post('/timeseries')
                .expect('Content-Type', /json/)
                .send({
                    unit: 'test unit',
                    timestamp: 1,
                    value: 0.5,
                    device_id: "123"
                });

            expect(response.statusCode).toBe(HttpStatus.CREATED.code);
            expect(response.body.httpStatus).toBe(HttpStatus.CREATED.status);
        });

        test('should return an error when the body field is invalid', async () => {
            const response = await request
                .post('/timeseries')
                .expect('Content-Type', /json/)
                .send({
                    invalidField: 'Test timeseries',
                    timeseries: 1,
                    value: 0.5,
                    device_id: "123"
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });

        test('should return an error when the body field type is invalid', async () => {
            const response = await request
                .post('/timeseries')
                .expect('Content-Type', /json/)
                .send({
                    unit: 1,
                    timeseries: 1,
                    value: 0.5,
                    device_id: "123"
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });
    });

    describe('getTimeseries/:id', () => {
        test('should get a timeseries with an id', async () => {
            await processData(Query.CREATE_TIMESERIES)
            const response = await request.get('/timeseries/123');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.timeseriess).toBeDefined();
        });

        test('should return an error when getAll with invalid id', async () => {
            const response2 = await request.get('/timeseries/321');

            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('getTimeseries', () => {
        test('should return a list of timeseries', async () => {
            await processData(Query.CREATE_TIMESERIES)
            const response = await request.get('/timeseries');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.timeseriess).toBeDefined();
        });
    });

    describe('deleteTimeseries/:id', () => {
        test('should delete the timeseries', async () => {
            await processData(Query.CREATE_TIMESERIES)
            const response = await request.delete('/timeseries/123');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when delete with invalid id ', async () => {
            const response2 = await request.delete('/timeseries/321');
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

});