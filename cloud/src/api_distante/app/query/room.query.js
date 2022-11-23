const QUERY = {
    SELECT_ROOMS: 'SELECT * FROM rooms ORDER BY created_at DESC LIMIT 100',
    SELECT_ROOM: 'SELECT * FROM rooms WHERE id = ?',
    CREATE_ROOM: 'INSERT INTO rooms(name, floorID, batID) VALUES (?, ?, ?)',
    UPDATE_ROOM: 'UPDATE rooms SET name = ?, floorID = ?, batID = ? WHERE id = ?',
    DELETE_ROOM: 'DELETE FROM rooms WHERE id = ?',
    CREATE_ROOM_PROCEDURE: 'CALL create_and_return(?, ?, ?)'
  };
  
  export default QUERY;

