import Joi from 'joi'

const sousScenarioCreateSchema = Joi.object().keys({
  device_id: Joi.string().required(),
  action: Joi.string().required().valid("allumer", "eteindre", "couleur", "intensite", "temperature"),
});

const sousScenarioUpdateSchema = Joi.object().keys({
  device_id: Joi.string().optional(),
  action: Joi.string().optional().valid("allumer", "eteindre", "couleur", "intensite", "temperature"),
});

export default sousScenarioCreateSchema;
export { sousScenarioUpdateSchema };