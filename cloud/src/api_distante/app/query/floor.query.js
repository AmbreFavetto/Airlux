const QUERY = {
    SELECT_FLOORS: 'SELECT * FROM floors ORDER BY created_at DESC LIMIT 100',
    SELECT_FLOOR: 'SELECT * FROM floors WHERE id = ?',
    CREATE_FLOOR: 'INSERT INTO floors(name, batID) VALUES (?, ?)',
    UPDATE_FLOOR: 'UPDATE floors SET name = ?, batID = ? WHERE id = ?',
    DELETE_FLOOR: 'DELETE FROM floors WHERE id = ?',
    CREATE_FLOOR_PROCEDURE: 'CALL create_and_return(?, ?)'
  };
  
  export default QUERY;




