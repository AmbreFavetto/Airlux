const QUERY = {
    SELECT_FLOORS: 'SELECT * FROM floors ORDER BY floor_id DESC LIMIT 100',
    SELECT_FLOOR: 'SELECT * FROM floors WHERE floor_id = ?',
    CREATE_FLOOR: 'INSERT INTO floors(name, building_id) VALUES (?, ?)',
    UPDATE_FLOOR: 'UPDATE floors SET name = ?, building_id = ? WHERE floor_id = ?',
    DELETE_FLOOR: 'DELETE FROM floors WHERE floor_id = ?',
    CREATE_FLOOR_PROCEDURE: 'CALL create_and_return(?, ?)'
  };
  
  export default QUERY;




