const QUERY = {
    SELECT_USERS: 'SELECT * FROM user ORDER BY user_id',
    SELECT_USER: 'SELECT * FROM user WHERE user_id = ?',
    CREATE_USER: 'INSERT INTO user(name, forename, email, password, is_admin, building_id) VALUES (?, ?, ?, ?, ?, ?)',
    UPDATE_USER: 'UPDATE user SET name = ?, forename = ?, email = ?, password=?, is_admin = ?, building_id = ? WHERE user_id = ?',
    DELETE_USER: 'DELETE FROM user WHERE user_id = ?',
    CREATE_USER_PROCEDURE: 'CALL create_user_and_return(?, ?, ?, ?, ?, ?)'
  };
  
  export default QUERY;