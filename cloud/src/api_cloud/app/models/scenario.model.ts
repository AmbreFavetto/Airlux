import Joi from 'joi'

const scenarioCreateSchema = Joi.object().keys({
    name: Joi.string().required(),
    device_id: Joi.string().required()
  });

  const scenarioUpdateSchema = Joi.object().keys({
    name: Joi.string().optional(),
    device_id: Joi.string().optional()
  });

export default scenarioCreateSchema;
export {scenarioUpdateSchema};