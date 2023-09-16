import Joi from 'joi'

const userCreateSchema = Joi.object().keys({
  name: Joi.string().required(),
  forename: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  is_admin: Joi.bool().default(false),
  user_id: Joi.string().optional()
});

const userUpdateSchema = Joi.object().keys({
  name: Joi.string().optional(),
  forename: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  is_admin: Joi.bool().optional(),
});

const userLoginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required()
})

export default userCreateSchema;
export { userUpdateSchema, userLoginSchema };