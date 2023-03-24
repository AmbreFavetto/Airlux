import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';
import pool from '../app/config/db.config';
import logger from '../app/util/logger';

const request = supertest(app);

function insertTestData() {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO building(name, building_id) VALUES ('SYLVAIN', '123')", (err: Error, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

describe('Building controller', () => {
    afterEach(async () => {
        // Réinitialiser la base de données avant chaque test
        await pool.query('DELETE FROM building')
    });
    afterAll(async () => {
        await pool.end();
    });

    describe('createBuilding', () => {
        test('should create a new building', async () => {
            const response = await request.post('/building')
                .expect('Content-Type', /json/)
                .send({
                    name: 'Test building'
                });

            expect(response.statusCode).toBe(HttpStatus.CREATED.code);
            expect(response.body.httpStatus).toBe(HttpStatus.CREATED.status);
        });

        test('should return an error when the body field is invalid', async () => {
            const response = await request.post('/building')
                .expect("Content-Type", /json/)
                .send({
                    invalidField: 'Test'
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });

        test('should return an error when the body field type is invalid', async () => {
            const response = await request.post('/building')
                .expect("Content-Type", /json/)
                .send({
                    name: 1
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });
    });

    describe('getBuilding/:id', () => {
        test('should get a building with an id', async () => {
            await insertTestData()
            const response = await request.get('/building/123');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.buildings).toBeDefined();

        });

        test('should return an error when getAll with invalid id', async () => {
            const response2 = await request.get('/building/321');

            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('getBuildings', () => {
        test('should return a list of buildings', async () => {
            await insertTestData()
            // Effectuer la requête et vérifier la réponse
            const response = await request.get('/building');
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.buildings).toBeDefined();
        });

        test('should return an error when no buildings are found', async () => {
            const response2 = await request.get('/building');
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    // describe('deleteBuilding/:id', () => {
    //     test('should delete the building', async () => {
    //         await insertTestData()
    //         const response = await request.delete('/building/123');
    //         expect(response.statusCode).toBe(HttpStatus.OK.code);
    //         expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
    //     });

    //     test('should return an error when delete with invalid id ', async () => {
    //         const response2 = await request.delete('/building/321');
    //         expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
    //         expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
    //     });
    // });

    // describe('updateBuilding/:id', () => {
    //     test('should update the building', async () => {
    //         await insertTestData()
    //         const response = await request.delete('/building/123');
    //         expect(response.statusCode).toBe(HttpStatus.OK.code);
    //         expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
    //     });

    //     test('should return an error when update with invalid id ', async () => {
    //         const response2 = await request.delete('/building/321');
    //         expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
    //         expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
    //     });
    // });
});
