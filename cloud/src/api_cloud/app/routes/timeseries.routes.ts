import express from 'express';
import { getTimeseriess, createTimeseries, getTimeseries, deleteTimeseries, updateTimeseries } from '../controllers/Timeseries.controller';

const TimeseriesRoutes = express.Router();

TimeseriesRoutes.route('/')
  .get(getTimeseriess)
  .post(createTimeseries);

  TimeseriesRoutes.route('/:id')
  .get(getTimeseries)
  .put(updateTimeseries)
  .delete(deleteTimeseries);

export default TimeseriesRoutes;