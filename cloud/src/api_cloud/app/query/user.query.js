const QUERY = {
    SELECT_USERS: 'SELECT * FROM users ORDER BY user_id',
    SELECT_USER: 'SELECT * FROM users WHERE user_id = ?',
    CREATE_USER: 'INSERT INTO users(name, forename, email, password, is_admin, building_id) VALUES (?, ?, ?, ?, ?, ?)',
    UPDATE_USER: 'UPDATE users SET name = ?, forename = ?, email = ?, password=?, is_admin = ?, building_id = ? WHERE user_id = ?',
    DELETE_USER: 'DELETE FROM users WHERE user_id = ?',
    CREATE_USER_PROCEDURE: 'CALL create_and_return(?, ?, ?, ?, ?, ?)'
  };
  
  export default QUERY;

