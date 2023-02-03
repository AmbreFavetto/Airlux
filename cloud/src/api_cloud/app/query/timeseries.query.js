const QUERY = {
    SELECT_TIMESERIESS: 'SELECT * FROM timeseries ORDER BY timeseries_id',
    SELECT_TIMESERIES: 'SELECT * FROM timeseries WHERE timeseries_id = ?',
    CREATE_TIMESERIES: 'INSERT INTO timeseries(unit, timestamp, value, device_id) VALUES (?, ?, ?, ?)',
    UPDATE_TIMESERIES: 'UPDATE timeseries SET unit = ?, timestamp = ?, value = ?, device_id = ? WHERE timeseries_id = ?',
    DELETE_TIMESERIES: 'DELETE FROM timeseries WHERE timeseries_id = ?',
    CREATE_TIMESERIES_PROCEDURE: 'CALL create_timeseries_and_return(?, ?, ?, ?)'
  };
  
  export default QUERY;