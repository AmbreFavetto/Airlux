import Joi from 'joi'

const scenarioCreateSchema = Joi.object().keys({
    name: Joi.string().required(),
    device_id: Joi.array().items(Joi.string().optional()).optional()
  });

  const scenarioUpdateSchema = Joi.object().keys({
    name: Joi.string().optional(),
    device_id: Joi.array().items(Joi.string().optional()).optional()
  });

export default scenarioCreateSchema;
export {scenarioUpdateSchema};