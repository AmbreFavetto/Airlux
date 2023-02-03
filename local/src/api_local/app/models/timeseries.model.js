import Joi from 'joi'

const timeseriesSchema = Joi.object().keys({
    timestamp: Joi.number().required(),
    unit: Joi.string().required(),
    value: Joi.required(),
    device_id: Joi.string().required()
  });

export default timeseriesSchema;