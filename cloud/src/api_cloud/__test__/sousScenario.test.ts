import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';
import pool from '../app/config/db.config';
import Query, { processData } from './testTools'
import jwt from 'jsonwebtoken';
const secretKey = process.env.SECRET_KEY || "secret_key"
let token = "";
const request = supertest(app);

describe('SousScenario controller', () => {
    beforeAll(async () => {
        await processData(Query.CREATE_BUILDING)
        await processData(Query.CREATE_FLOOR)
        await processData(Query.CREATE_ROOM)
        await processData(Query.CREATE_DEVICE)
        token = jwt.sign({
            id: "fix-id-token",
            email: "fix-email-token",
            isadmin: "fix-admin-token"
        }, secretKey, { expiresIn: '3 hours' })
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
                .set('Authorization', `${token}`)
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
                .set('Authorization', `${token}`)
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
                .set('Authorization', `${token}`)
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
            const response = await request.get('/sous-scenario/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.sousScenarios).toBeDefined();
        });

        test('should return an error when getAll with invalid id', async () => {
            const response2 = await request.get('/sous-scenario/321').set('Authorization', `${token}`);

            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('getSousScenarios', () => {
        test('should return a list of sousScenario', async () => {
            await processData(Query.CREATE_SOUS_SCENARIO)
            const response = await request.get('/sous-scenario').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.sousScenarios).toBeDefined();
        });
    });

    describe('deleteSousScenario/:id', () => {
        test('should delete the sousScenario', async () => {
            await processData(Query.CREATE_SOUS_SCENARIO)
            const response = await request.delete('/sous-scenario/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when delete with invalid id ', async () => {
            const response2 = await request.delete('/sous-scenario/321').set('Authorization', `${token}`);
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

});