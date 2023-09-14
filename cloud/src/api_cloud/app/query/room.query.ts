const QUERY = {
  SELECT_ROOMS: 'SELECT * FROM room ORDER BY room_id',
  SELECT_ROOM: 'SELECT * FROM room WHERE room_id = ?',
  CREATE_ROOM: 'INSERT INTO room(name, floor_id, room_id) VALUES (?, ?, ?)',
  UPDATE_ROOM: 'UPDATE room SET name = ? WHERE room_id = ?',
  DELETE_ROOM: 'DELETE FROM room WHERE room_id = ?',
  SELECT_FLOOR: 'SELECT * FROM floor WHERE floor_id = ?'
};

export default QUERY;