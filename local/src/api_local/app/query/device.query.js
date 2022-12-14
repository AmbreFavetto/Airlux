const QUERY = {
    SELECT_DEVICES: 'SELECT * FROM devices ORDER BY device_id DESC LIMIT 100',
    SELECT_DEVICE: 'SELECT * FROM devices WHERE device_id = ?',
    CREATE_DEVICE: 'INSERT INTO devices(name, type, room_id, floor_id, building_id) VALUES (?, ?, ?, ?, ?)',
    UPDATE_DEVICE: 'UPDATE devices SET name = ?, room_id = ?, floor_id = ?, building_id = ? WHERE device_id = ?',
    DELETE_DEVICE: 'DELETE FROM devices WHERE device_id = ?',
    CREATE_DEVICE_PROCEDURE: 'CALL create_and_return(?, ?, ?)'
  };
  
  export default QUERY;