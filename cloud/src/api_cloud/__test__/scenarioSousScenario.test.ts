import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';
import pool from '../app/config/db.config';
import Query, { processData } from './testTools'
import jwt from 'jsonwebtoken';
const secretKey = process.env.SECRET_KEY || "secret_key"
let token = "";
const request = supertest(app);

describe('ScenarioSousScenario controller', () => {
    beforeAll(async () => {
        await processData(Query.CREATE_BUILDING)
        await processData(Query.CREATE_FLOOR)
        await processData(Query.CREATE_ROOM)
        await processData(Query.CREATE_DEVICE)
        await processData(Query.CREATE_SOUS_SCENARIO)

        await processData(Query.CREATE_SCENARIO)
        token = jwt.sign({
            id: "fix-id-token",
            email: "fix-email-token",
            isadmin: "fix-admin-token"
        }, secretKey, { expiresIn: '3 hours' })
    })
    afterEach(async () => {
        await processData(Query.DELETE_SCENARIO_SOUS_SCENARIOS)
    });

    afterAll(async () => {
        await processData(Query.DELETE_BUILDINGS)
        await processData(Query.DELETE_SCENARIOS)
        await pool.end()
    });

    describe('createScenarioSousScenario', () => {
        test('should create a new scenarioSousScenario', async () => {
            const response = await request
                .post('/scenario-sous-scenario')
                .set('Authorization', `${token}`)
                .expect('Content-Type', /json/)
                .send({
                    scenario_id: '123',
                    sousScenario_id: '123'
                });

            expect(response.statusCode).toBe(HttpStatus.CREATED.code);
            expect(response.body.httpStatus).toBe(HttpStatus.CREATED.status);
        });

        test('should return an error when the body field is invalid', async () => {
            const response = await request
                .post('/scenario-sous-scenario')
                .set('Authorization', `${token}`)
                .expect('Content-Type', /json/)
                .send({
                    invalidField: 'Test sousScenario',
                    sousScenario_id: '123'
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });

        test('should return an error when the body field type is invalid', async () => {
            const response = await request
                .post('/scenario-sous-scenario')
                .set('Authorization', `${token}`)
                .expect('Content-Type', /json/)
                .send({
                    scenario_id: 1,
                    sousScenario_id: '123'
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });
    });

    describe('getScenarioSousScenario/:id', () => {
        test('should get a scenarioSousScenario with an id', async () => {
            await processData(Query.CREATE_SCENARIO_SOUS_SCENARIO)
            const response = await request.get('/scenario-sous-scenario/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.scenariosSousScenarios).toBeDefined();
        });

        test('should return an error when getAll with invalid id', async () => {
            const response2 = await request.get('/scenario-sous-scenario/321').set('Authorization', `${token}`);

            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('getScenarioSousScenarios', () => {
        test('should return a list of scenarioSousScenarios', async () => {
            await processData(Query.CREATE_SCENARIO_SOUS_SCENARIO)
            const response = await request.get('/scenario-sous-scenario').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.scenariosSousScenarios).toBeDefined();
        });
    });

    describe('deleteScenarioSousScenario/:id', () => {
        test('should delete the scenarioSousScenario', async () => {
            await processData(Query.CREATE_SCENARIO_SOUS_SCENARIO)
            const response = await request.delete('/scenario-sous-scenario/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when delete with invalid id ', async () => {
            const response2 = await request.delete('/scenario-sous-scenario/321').set('Authorization', `${token}`);
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

});