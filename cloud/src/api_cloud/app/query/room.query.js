const QUERY = {
    SELECT_ROOMS: 'SELECT * FROM room ORDER BY room_id',
    SELECT_ROOM: 'SELECT * FROM room WHERE room_id = ?',
    CREATE_ROOM: 'INSERT INTO room(name, floor_id) VALUES (?, ?)',
    UPDATE_ROOM: 'UPDATE room SET name = ?, floor_id = ? WHERE room_id = ?',
    DELETE_ROOM: 'DELETE FROM room WHERE room_id = ?',
    CREATE_ROOM_PROCEDURE: 'CALL create_room_and_return(?, ?)'
  };
  
  export default QUERY;