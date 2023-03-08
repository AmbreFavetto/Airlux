import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';

const request = supertest(app);

describe('Building controller', () => {
    describe('getBuildings', () => {
        test('should return a list of buildings', async () => {
            const response = await request.get('/building');

            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.buildings).toBeDefined();
        });

        test('should return an error when no buildings are found', async () => {
            // Assuming there are no buildings in the database
            const response = await request.get('/building');

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('createBuilding', () => {
        test('should create a new building', async () => {
            const response = await request.post('/building').send({
                name: 'Test building'
            });

            expect(response.statusCode).toBe(HttpStatus.CREATED.code);
            expect(response.body.httpStatus).toBe(HttpStatus.CREATED.status);

        });

        test('should return an error when the body field is invalid', async () => {
            const response = await request.post('/building').send({
                invalidField: 'Test'
            });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });

        test('should return an error when the body field type is invalid', async () => {
            const response = await request.post('/building').send({
                name: 1
            });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });
    });
});