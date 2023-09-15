import Joi from 'joi'

const scenarioSousScenarioBuildingCreateSchema = Joi.object().keys({
  scenario_id: Joi.string().required(),
  sousScenario_id: Joi.string().required(),
  id: Joi.string().optional()
});

export default scenarioSousScenarioBuildingCreateSchema;