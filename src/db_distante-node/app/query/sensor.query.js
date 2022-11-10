const QUERY = {
    SELECT_SENSORS: 'SELECT * FROM sensors ORDER BY created_at DESC LIMIT 100',
    SELECT_SENSOR: 'SELECT * FROM sensors WHERE id = ?',
    CREATE_SENSOR: 'INSERT INTO sensors(first_name, last_name, email, phone, address, diagnosis, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    UPDATE_SENSOR: 'UPDATE sensors SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, diagnosis = ?, image_url = ? WHERE id = ?',
    DELETE_SENSOR: 'DELETE FROM sensors WHERE id = ?',
    CREATE_SENSOR_PROCEDURE: 'CALL create_and_return(?, ?, ?, ?, ?, ?, ?)'
  };
  
  export default QUERY;




  /////////// CHANGE PARAMETERS