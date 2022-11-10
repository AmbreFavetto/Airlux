const QUERY = {
    SELECT_ACTUATORS: 'SELECT * FROM actuators ORDER BY created_at DESC LIMIT 100',
    SELECT_ACTUATOR: 'SELECT * FROM actuators WHERE id = ?',
    CREATE_ACTUATOR: 'INSERT INTO actuators(first_name, last_name, email, phone, address, diagnosis, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    UPDATE_ACTUATOR: 'UPDATE actuators SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, diagnosis = ?, image_url = ? WHERE id = ?',
    DELETE_ACTUATOR: 'DELETE FROM actuators WHERE id = ?',
    CREATE_ACTUATOR_PROCEDURE: 'CALL create_and_return(?, ?, ?, ?, ?, ?, ?)'
  };
  
  export default QUERY;




  /////////// CHANGE PARAMETERS