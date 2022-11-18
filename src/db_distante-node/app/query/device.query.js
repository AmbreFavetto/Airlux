const QUERY = {
    SELECT_DEVICES: 'SELECT * FROM devices ORDER BY created_at DESC LIMIT 100',
    SELECT_DEVICE: 'SELECT * FROM devices WHERE id = ?',
    CREATE_DEVICE: 'INSERT INTO devices(name, type, roomID, floorID, batID) VALUES (?, ?, ?, ?, ?)',
    UPDATE_DEVICE: 'UPDATE devices SET name = ?, type = ?, roomID = ?, floorID = ?, batID = ? WHERE id = ?',
    DELETE_DEVICE: 'DELETE FROM devices WHERE id = ?',
    CREATE_DEVICE_PROCEDURE: 'CALL create_and_return(?, ?, ?)'
  };
  
  export default QUERY;