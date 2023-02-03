const QUERY = {
    SELECT_DEVICES: 'SELECT * FROM device ORDER BY device_id DESC LIMIT 100',
    SELECT_DEVICE: 'SELECT * FROM device WHERE device_id = ?',
    CREATE_DEVICE: 'INSERT INTO device(name, room_id, type) VALUES (?, ?, ?)',
    UPDATE_DEVICE: 'UPDATE device SET name = ?, room_id = ?, type = ? WHERE device_id = ?',
    DELETE_DEVICE: 'DELETE FROM device WHERE device_id = ?',
    CREATE_DEVICE_PROCEDURE: 'CALL create_device_and_return(?, ?, ?)'
  };
  
  export default QUERY;