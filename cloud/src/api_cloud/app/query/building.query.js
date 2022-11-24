const QUERY = {
    SELECT_BULDINGS: 'SELECT * FROM buildings ORDER BY building_id DESC LIMIT 100',
    SELECT_BULDING: 'SELECT * FROM buildings WHERE building_id = ?',
    CREATE_BULDING: 'INSERT INTO buildings(name) VALUES (?)',
    UPDATE_BULDING: 'UPDATE buildings SET first_name = ? WHERE building_id = ?',
    DELETE_BULDING: 'DELETE FROM buildings WHERE building_id = ?',
    CREATE_BULDING_PROCEDURE: 'CALL create_and_return(?)'
  };
  
  export default QUERY;




  /////////// CHANGE PARAMETERS

