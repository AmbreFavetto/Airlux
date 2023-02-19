import Joi from 'joi'

const timeseriesCreateSchema = Joi.object().keys({
    timestamp: Joi.number().required(),
    unit: Joi.string().required(),
    value: Joi.number().required(),
    device_id: Joi.string().required()
  });

  const timeseriesUpdateSchema = Joi.object().keys({
    timestamp: Joi.number().optional(),
    unit: Joi.string().optional(),
    value: Joi.number().optional(),
    device_id: Joi.string().optional()
  });

export default timeseriesCreateSchema;
export {timeseriesUpdateSchema};