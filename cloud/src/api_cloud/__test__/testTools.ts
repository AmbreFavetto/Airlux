import pool from '../app/config/db.config';

// TEST

const QUERY = {
    CREATE_BUILDING: 'INSERT INTO building(name, building_id) VALUES ("testBuilding", "123")',
    CREATE_OTHER_BUILDING: 'INSERT INTO building(name, building_id) VALUES ("testBuilding", "234")',
    DELETE_BUILDINGS: 'DELETE FROM building',
    CREATE_FLOOR: 'INSERT INTO floor(name, building_id, floor_id) VALUES ("testFloor", "123", "123")',
    DELETE_FLOORS: 'DELETE FROM floor',
    CREATE_ROOM: 'INSERT INTO room(name, floor_id, room_id) VALUES ("testRoom", "123", "123")',
    DELETE_ROOMS: 'DELETE FROM room',
    CREATE_DEVICE: 'INSERT INTO device(name, room_id, device_id, category, value) VALUES ("testDevice", "123", "123", "lamp", 0.5)',
    DELETE_DEVICES: 'DELETE FROM device',
    CREATE_SCENARIO: 'INSERT INTO scenario(name, scenario_id) VALUES ("testScenario", "123")',
    CREATE_OTHER_SCENARIO: 'INSERT INTO scenario(name, scenario_id) VALUES ("testScenario", "234")',
    DELETE_SCENARIOS: 'DELETE FROM scenario',
    CREATE_SOUS_SCENARIO: 'INSERT INTO sousScenario(device_id, sousScenario_id, action) VALUES ("123", "123", "on")',
    DELETE_SOUS_SCENARIOS: 'DELETE FROM sousScenario',
    CREATE_SCENARIO_SOUS_SCENARIO: 'INSERT INTO scenarioSousScenario(scenario_id, sousScenario_id, id) VALUES ("123", "123", "123")',
    DELETE_SCENARIO_SOUS_SCENARIOS: 'DELETE FROM scenarioSousScenario',
    CREATE_USER: 'INSERT INTO user(name, forename, email, password, is_admin, user_id) VALUES ("test", "test", "test@test.com", "test", True, "123")',
    DELETE_USERS: 'DELETE FROM user',
    CREATE_USER_BUILDING: 'INSERT INTO userBuilding(user_id, building_id, id) VALUES ("123", "123", "123")',
    DELETE_USER_BUILDINGS: 'DELETE FROM userBuilding',
    CREATE_TIMESERIES: 'INSERT INTO timeseries(unit, time, value, device_id, timeseries_id) VALUES ("unit", "2023-04-21 12:00:00", 0.5, "123", "123")',
    DELETE_TIMESERIESS: 'DELETE FROM timeseries',
};

function processData(query: string) {
    return new Promise((resolve, reject) => {
        pool.query(query, (err: Error, result: unknown) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export default QUERY;
export { processData };