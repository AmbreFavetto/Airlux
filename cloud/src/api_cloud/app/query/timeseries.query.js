const QUERY = {
    SELECT_TIMESERIESS: 'SELECT * FROM TIMESERIES ORDER BY device_id',
    SELECT_TIMESERIES: 'SELECT * FROM TIMESERIES WHERE device_id = ?',
    CREATE_TIMESERIES: 'INSERT INTO TIMESERIES(unit, timestamp, value) VALUES (?, ?, ?)',
    UPDATE_TIMESERIES: 'UPDATE TIMESERIES SET unit = ?, timestamp = ?, value = ? WHERE device_id = ?',
    DELETE_TIMESERIES: 'DELETE FROM TIMESERIES WHERE device_id = ?',
    CREATE_TIMESERIES_PROCEDURE: 'CALL create_TIMESERIES_and_return(?, ?, ?)'
  };
  
  export default QUERY;