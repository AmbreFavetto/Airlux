import app from '../app/index';
import supertest from 'supertest';
import { matchRegex, setDefaultValue } from '../app/controllers/device.controller';
import { verifyAction } from '../app/controllers/sousScenario.controller';

const request = supertest(app);

describe('Unit tests for device functions', () => {

    describe('matchRegex', () => {
        test('should return true', async () => {
            expect(matchRegex("0,0", "lamp")).toBe(true);
            expect(matchRegex("0,0,255,255,255", "lamp_rgb")).toBe(true);
            expect(matchRegex("0", "blind")).toBe(true);
            expect(matchRegex("0", "radiator")).toBe(true);
            expect(matchRegex("0", "air_conditioning")).toBe(true);
            expect(matchRegex("0.0", "humidity")).toBe(true);
            expect(matchRegex("0.0", "temperature")).toBe(true);
            expect(matchRegex("0.0", "pressure")).toBe(true);
        });

        test('should return false', async () => {
            expect(matchRegex("3", "lamp")).toBe(false);
            expect(matchRegex("9,100,1255", "lamp_rgb")).toBe(false);
            expect(matchRegex("90", "blind")).toBe(false);
            expect(matchRegex("0,7", "radiator")).toBe(false);
            expect(matchRegex("255,1", "air_conditioning")).toBe(false);
            expect(matchRegex("a", "humidity")).toBe(false);
            expect(matchRegex("3,1", "temperature")).toBe(false);
            expect(matchRegex("21b", "pressure")).toBe(false);
        });

    });

    describe('setDefaultValue', () => {
        test('should set the right default values', async () => {
            expect(setDefaultValue("lamp")).toBe("0,0");
            expect(setDefaultValue("lamp_rgb")).toBe("0,0,255,255,255");
            expect(setDefaultValue("blind")).toBe("0");
            expect(setDefaultValue("radiator")).toBe("0");
            expect(setDefaultValue("air_conditioning")).toBe("0");
            expect(setDefaultValue("humidity")).toBe("0.0");
            expect(setDefaultValue("temperature")).toBe("0.0");
            expect(setDefaultValue("pressure")).toBe("0.0");
        });
    });

});

describe('Unit tests for sousScenario functions', () => {

    describe('verifyAction', () => {
        test('should return true', async () => {
            expect(verifyAction("lamp", "on")).toBe(true);
            expect(verifyAction("lamp", "off")).toBe(true);
            expect(verifyAction("lamp", "intensity")).toBe(true);
            expect(verifyAction("lamp_rgb", "on")).toBe(true);
            expect(verifyAction("lamp_rgb", "off")).toBe(true);
            expect(verifyAction("lamp_rgb", "intensity")).toBe(true);
            expect(verifyAction("lamp_rgb", "color")).toBe(true);
            expect(verifyAction("blind", "open")).toBe(true);
            expect(verifyAction("blind", "close")).toBe(true);
            expect(verifyAction("radiator", "on")).toBe(true);
            expect(verifyAction("radiator", "off")).toBe(true);
            expect(verifyAction("radiator", "temperature")).toBe(true);
            expect(verifyAction("air_conditioning", "on")).toBe(true);
            expect(verifyAction("air_conditioning", "off")).toBe(true);
            expect(verifyAction("air_conditioning", "temperature")).toBe(true);
        });

        test('should return false', async () => {
            expect(verifyAction("lamp", "this")).toBe(false);
            expect(verifyAction("lamp_rgb", "is")).toBe(false);
            expect(verifyAction("blind", "a")).toBe(false);
            expect(verifyAction("radiator", "wrong")).toBe(false);
            expect(verifyAction("air_conditioning", "value")).toBe(false);
        });

    });

});