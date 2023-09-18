import HttpStatus from '../app/util/devTools';
import app from '../app/index';
import supertest from 'supertest';
import pool from '../app/config/db.config';
import Query, { processData } from './testTools'
import jwt from 'jsonwebtoken';
const secretKey = process.env.SECRET_KEY || "secret_key"
let token = "";
const request = supertest(app);

describe('Device controller', () => {
    beforeAll(async () => {
        await processData(Query.CREATE_BUILDING)
        await processData(Query.CREATE_FLOOR)
        await processData(Query.CREATE_ROOM)
        token = jwt.sign({
            id: "fix-id-token",
            email: "fix-email-token",
            isadmin: "fix-admin-token"
        }, secretKey, { expiresIn: '3 hours' })
    });

    afterEach(async () => {
        await processData(Query.DELETE_DEVICES)
    });

    afterAll(async () => {
        await processData(Query.DELETE_BUILDINGS)
        await pool.end()
    });

    describe('createDevice', () => {
        test('should create a new device', async () => {
            const response = await request
                .post('/device')
                .set('Authorization', `${token}`)
                .expect('Content-Type', /json/)
                .send({
                    name: 'Test device',
                    room_id: '123',
                    category: 'lamp'
                });

            expect(response.statusCode).toBe(HttpStatus.CREATED.code);
            expect(response.body.httpStatus).toBe(HttpStatus.CREATED.status);
        });

        test('should return an error when the body field is invalid', async () => {
            const response = await request
                .post('/device')
                .set('Authorization', `${token}`)
                .expect('Content-Type', /json/)
                .send({
                    invalidField: 'Test device',
                    room_id: '123',
                    category: 'lamp'
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });

        test('should return an error when the body field type is invalid', async () => {
            const response = await request
                .post('/device')
                .set('Authorization', `${token}`)
                .expect('Content-Type', /json/)
                .send({
                    name: 1,
                    room_id: '123',
                    category: 'lamp'
                });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
            expect(response.body.httpStatus).toBe(HttpStatus.BAD_REQUEST.status);
        });
    });

    describe('getDevice/:id', () => {
        test('should get a device with an id', async () => {
            await processData(Query.CREATE_DEVICE)
            const response = await request.get('/device/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.devices).toBeDefined();
        });

        test('should return an error when getAll with invalid id', async () => {
            const response2 = await request.get('/device/321').set('Authorization', `${token}`);

            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('getDevices', () => {
        test('should return a list of devices', async () => {
            await processData(Query.CREATE_DEVICE)
            const response = await request.get('/device').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
            expect(response.body.data.devices).toBeDefined();
        });
    });

    describe('deleteDevice/:id', () => {
        test('should delete the device', async () => {
            await processData(Query.CREATE_DEVICE)
            const response = await request.delete('/device/123').set('Authorization', `${token}`);
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when delete with invalid id ', async () => {
            const response2 = await request.delete('/device/321').set('Authorization', `${token}`);
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

    describe('updateDevice/:id', () => {
        test('should update the device', async () => {
            await processData(Query.CREATE_DEVICE)
            const response = await request
            .put('/device/123')
            .set('Authorization', `${token}`)
            .send({
                name: "TestUpdate"
            });
            expect(response.statusCode).toBe(HttpStatus.OK.code);
            expect(response.body.httpStatus).toBe(HttpStatus.OK.status);
        });

        test('should return an error when update with invalid id ', async () => {
            const response2 = await request.put('/device/321').set('Authorization', `${token}`);
            expect(response2.statusCode).toBe(HttpStatus.NOT_FOUND.code);
            expect(response2.body.httpStatus).toBe(HttpStatus.NOT_FOUND.status);
        });
    });

});