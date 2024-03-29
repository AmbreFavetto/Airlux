import Joi from 'joi'

const timeseriesCreateSchema = Joi.object().keys({
  unit: Joi.string().required(),
  value: Joi.number().required(),
  device_id: Joi.string().required(),
  timeseries: Joi.string().optional()
});

export default timeseriesCreateSchema;