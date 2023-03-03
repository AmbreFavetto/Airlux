const QUERY = {
  SELECT_USERS_BUILDINGS: 'SELECT * FROM user_building ORDER BY id',
  SELECT_USER_BUILDING: 'SELECT * FROM user_building WHERE id = ?',
  CREATE_USER_BUILDING: 'INSERT INTO user_building(user_id, building_id) VALUES (?, ?)',
  UPDATE_USER_BUILDING: 'UPDATE user_building SET user_id = ?, building_id = ? WHERE id = ?',
  DELETE_USER_BUILDING: 'DELETE FROM user_building WHERE id = ?',
  SELECT_USER: 'SELECT * FROM user WHERE user_id = ?',
  SELECT_BUILDING: 'SELECT * FROM building WHERE building_id = ?',
};

export default QUERY;