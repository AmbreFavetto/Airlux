import Joi from 'joi'

const timeseriesCreateSchema = Joi.object().keys({
  time: Joi.number().required(),
  unit: Joi.string().required(),
  value: Joi.number().required(),
  device_id: Joi.string().required()
});

const timeseriesUpdateSchema = Joi.object().keys({
  time: Joi.number().optional(),
  unit: Joi.string().optional(),
  value: Joi.number().optional(),
  device_id: Joi.string().optional()
});

export default timeseriesCreateSchema;
export { timeseriesUpdateSchema };