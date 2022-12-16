const QUERY = {
    SELECT_DEVICES: 'SELECT * FROM device ORDER BY device_id DESC LIMIT 100',
    SELECT_DEVICE: 'SELECT * FROM device WHERE device_id = ?',
    CREATE_DEVICE: 'INSERT INTO device(name, type, room_id, floor_id, building_id) VALUES (?, ?, ?, ?, ?)',
    UPDATE_DEVICE: 'UPDATE device SET name = ?, room_id = ?, floor_id = ?, building_id = ? WHERE device_id = ?',
    DELETE_DEVICE: 'DELETE FROM device WHERE device_id = ?',
    CREATE_DEVICE_PROCEDURE: 'CALL create_device_and_return(?, ?, ?, ?)'
  };
  
  export default QUERY;