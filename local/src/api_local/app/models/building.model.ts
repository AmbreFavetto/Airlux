import Joi from 'joi'

const buildingCreateSchema = Joi.object().keys({
  building_id: Joi.string().required(),
  name: Joi.string().required()
});

const buildingUpdateSchema = Joi.object().keys({
  name: Joi.string().optional()
});

export default buildingCreateSchema;
export { buildingUpdateSchema };
