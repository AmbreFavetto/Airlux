import Joi from 'joi'

const floorCreateSchema = Joi.object().keys({
  name: Joi.string().required(),
  building_id: Joi.string().required(),
  floor_id: Joi.string().optional()
});

const floorUpdateSchema = Joi.object().keys({
  name: Joi.string().optional(),
});

export default floorCreateSchema;
export { floorUpdateSchema };
