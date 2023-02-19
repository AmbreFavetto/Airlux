import Joi from 'joi'

const scenarioDeviceCreateSchema = Joi.object().keys({
    scenario_id: Joi.string().required(),
    device_id: Joi.string().required()
  });

  const scenarioDeviceUpdateSchema = Joi.object().keys({
    name: Joi.string().optional(),
    device_id: Joi.string().optional()
  });

export default scenarioDeviceCreateSchema;
export {scenarioDeviceUpdateSchema};