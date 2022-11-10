const QUERY = {
    SELECT_BATIMENTS: 'SELECT * FROM batiments ORDER BY created_at DESC LIMIT 100',
    SELECT_BATIMENT: 'SELECT * FROM batiments WHERE id = ?',
    CREATE_BATIMENT: 'INSERT INTO batiments(name) VALUES (?)',
    UPDATE_BATIMENT: 'UPDATE batiments SET first_name = ? WHERE id = ?',
    DELETE_BATIMENT: 'DELETE FROM batiments WHERE id = ?',
    CREATE_BATIMENT_PROCEDURE: 'CALL create_and_return(?)'
  };
  
  export default QUERY;




  /////////// CHANGE PARAMETERS

