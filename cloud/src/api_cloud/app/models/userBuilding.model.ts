import Joi from 'joi'

const userBuildingCreateSchema = Joi.object().keys({
  user_id: Joi.string().required(),
  building_id: Joi.string().required()
});

const userBuildingUpdateSchema = Joi.object().keys({
  user_id: Joi.string().optional(),
  building_id: Joi.string().optional()
});

export default userBuildingCreateSchema;
export { userBuildingUpdateSchema };