const QUERY = {
    SELECT_ROOMS: 'SELECT * FROM rooms ORDER BY room_id',
    SELECT_ROOM: 'SELECT * FROM rooms WHERE room_id = ?',
    CREATE_ROOM: 'INSERT INTO rooms(name, floor_id, building_id) VALUES (?, ?, ?)',
    UPDATE_ROOM: 'UPDATE rooms SET name = ?, floor_id = ?, building_id = ? WHERE room_id = ?',
    DELETE_ROOM: 'DELETE FROM rooms WHERE id = ?',
    CREATE_ROOM_PROCEDURE: 'CALL create_and_return(?, ?, ?)'
  };
  
  export default QUERY;

