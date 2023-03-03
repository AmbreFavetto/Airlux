import Joi from 'joi'

const scenarioSousScenarioCreateSchema = Joi.object().keys({
  scenario_id: Joi.string().required(),
  sous_scenario_id: Joi.string().required()
});

const scenarioSousScenarioUpdateSchema = Joi.object().keys({
  scenario_id: Joi.string().optional(),
  sous_scenario_id: Joi.string().optional()
});

export default scenarioSousScenarioCreateSchema;
export { scenarioSousScenarioUpdateSchema };