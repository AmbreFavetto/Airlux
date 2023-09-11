import Joi from 'joi'

const scenarioSousScenarioCreateSchema = Joi.object().keys({
  scenario_id: Joi.string().required(),
  sousScenario_id: Joi.string().required()
});

const scenarioSousScenarioUpdateSchema = Joi.object().keys({
  scenario_id: Joi.string().optional(),
  sousScenario_id: Joi.string().optional()
});

export default scenarioSousScenarioCreateSchema;
export { scenarioSousScenarioUpdateSchema };