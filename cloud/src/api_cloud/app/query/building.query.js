const QUERY = {
    SELECT_BUILDINGS: 'SELECT * FROM building ORDER BY building_id DESC LIMIT 100',
    SELECT_BUILDING: 'SELECT * FROM building WHERE building_id = ?',
    CREATE_BUILDING: 'INSERT INTO building(name) VALUES (?)',
    UPDATE_BUILDING: 'UPDATE building SET name = ? WHERE building_id = ?',
    DELETE_BUILDING: 'DELETE FROM building WHERE building_id = ?',
    CREATE_BUILDING_PROCEDURE: 'CALL create_building_and_return(?)'
  };
  
  export default QUERY;

