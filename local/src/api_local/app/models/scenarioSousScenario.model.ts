import Joi from 'joi'

const scenarioSousScenarioBuildingCreateSchema = Joi.object().keys({
  scenario_id: Joi.string().required(),
  sousScenario_id: Joi.string().required()
});

const scenarioSousScenarioUpdateSchema = Joi.object().keys({
  scenario_id: Joi.string().optional(),
  souss_scenario_id: Joi.string().optional()
});

export default scenarioSousScenarioBuildingCreateSchema;
export { scenarioSousScenarioUpdateSchema };