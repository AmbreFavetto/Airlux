const QUERY = {
    SELECT_FLOORS: 'SELECT * FROM floor ORDER BY floor_id DESC LIMIT 100',
    SELECT_FLOOR: 'SELECT * FROM floor WHERE floor_id = ?',
    CREATE_FLOOR: 'INSERT INTO floor(name, building_id) VALUES (?, ?)',
    UPDATE_FLOOR: 'UPDATE floor SET name = ?, building_id = ? WHERE floor_id = ?',
    DELETE_FLOOR: 'DELETE FROM floor WHERE floor_id = ?',
    CREATE_FLOOR_PROCEDURE: 'CALL create_and_return(?, ?)'
  };
  
  export default QUERY;




