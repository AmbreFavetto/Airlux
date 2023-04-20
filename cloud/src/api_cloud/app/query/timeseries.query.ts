const QUERY = {
  SELECT_TIMESERIESS: 'SELECT * FROM timeseries ORDER BY timeseries_id',
  SELECT_TIMESERIES: 'SELECT * FROM timeseries WHERE timeseries_id = ?',
  CREATE_TIMESERIES: 'INSERT INTO timeseries(unit, time, value, device_id, timeseries_id) VALUES (?, FROM_UNIXTIME(?), ?, ?, ?)',
  UPDATE_TIMESERIES: 'UPDATE timeseries SET unit = ?, time= FROM_UNIXTIME(?), value = ?, device_id = ? WHERE timeseries_id = ?',
  DELETE_TIMESERIES: 'DELETE FROM timeseries WHERE timeseries_id = ?',
}

export default QUERY;