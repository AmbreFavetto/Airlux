const QUERY = {
  SELECT_USERS_BUILDINGS: 'SELECT * FROM userBuilding ORDER BY id',
  SELECT_USER_BUILDING: 'SELECT * FROM userBuilding WHERE id = ?',
  CREATE_USER_BUILDING: 'INSERT INTO userBuilding(user_id, building_id) VALUES (?, ?)',
  UPDATE_USER_BUILDING: 'UPDATE userBuilding SET user_id = ?, building_id = ? WHERE id = ?',
  DELETE_USER_BUILDING: 'DELETE FROM userBuilding WHERE id = ?',
  SELECT_USER: 'SELECT * FROM user WHERE user_id = ?',
  SELECT_BUILDING: 'SELECT * FROM building WHERE building_id = ?',
};

export default QUERY;