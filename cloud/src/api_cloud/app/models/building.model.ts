import Joi from 'joi'

const buildingCreateSchema = Joi.object().keys({
  name: Joi.string().required(),
  building_id: Joi.string().optional()
});

const buildingUpdateSchema = Joi.object().keys({
  name: Joi.string().optional()
});

export default buildingCreateSchema;
export { buildingUpdateSchema };
