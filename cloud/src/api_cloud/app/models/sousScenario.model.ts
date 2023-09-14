import Joi from 'joi'

const sousScenarioCreateSchema = Joi.object().keys({
  device_id: Joi.string().required(),
  action: Joi.string().required().valid("on", "off", "color", "intensity", "open", "close", "temperature"),
  sousScenario_id: Joi.string().optional()
});

const sousScenarioUpdateSchema = Joi.object().keys({
  device_id: Joi.string().optional(),
  action: Joi.string().optional().valid("on", "off", "color", "intensity", "open", "close", "temperature"),
});

export default sousScenarioCreateSchema;
export { sousScenarioUpdateSchema };