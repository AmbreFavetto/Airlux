const QUERY = {
    SELECT_BUILDINGS: 'SELECT * FROM buildings ORDER BY created_at DESC LIMIT 100',
    SELECT_BUILDING: 'SELECT * FROM buildings WHERE id = ?',
    CREATE_BUILDING: 'INSERT INTO buildings(name) VALUES (?)',
    UPDATE_BUILDING: 'UPDATE buildings SET first_name = ? WHERE id = ?',
    DELETE_BUILDING: 'DELETE FROM buildings WHERE id = ?',
    CREATE_BUILDING_PROCEDURE: 'CALL create_and_return(?)'
  };
  
  export default QUERY;

