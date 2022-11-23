const QUERY = {
    SELECT_BULDINGS: 'SELECT * FROM buldings ORDER BY created_at DESC LIMIT 100',
    SELECT_BULDING: 'SELECT * FROM buldings WHERE id = ?',
    CREATE_BULDING: 'INSERT INTO buldings(name) VALUES (?)',
    UPDATE_BULDING: 'UPDATE buldings SET first_name = ? WHERE id = ?',
    DELETE_BULDING: 'DELETE FROM buldings WHERE id = ?',
    CREATE_BULDING_PROCEDURE: 'CALL create_and_return(?)'
  };
  
  export default QUERY;




  /////////// CHANGE PARAMETERS

