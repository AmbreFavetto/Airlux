const QUERY = {
  SELECT_TIMESERIESS: 'SELECT * FROM timeseries ORDER BY timeseries_id',
  SELECT_TIMESERIES: 'SELECT * FROM timeseries WHERE timeseries_id = ?',
  CREATE_TIMESERIES: 'INSERT INTO timeseries(unit, time, value, device_id, timeseries_id) VALUES (?, FROM_UNIXTIME(UNIX_TIMESTAMP()), ?, ?, ?)',
  DELETE_TIMESERIES: 'DELETE FROM timeseries WHERE timeseries_id = ?',
  SELECT_DEVICE: 'SELECT * FROM device WHERE device_id = ?',
}

export default QUERY;