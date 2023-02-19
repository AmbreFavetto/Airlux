import Joi from 'joi'

const userCreateSchema = Joi.object().keys({
    name: Joi.string().required(),
    forename: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    is_admin: Joi.bool().default(false),
});

  const userUpdateSchema = Joi.object().keys({
    name: Joi.string().optional(),
    forename: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    is_admin: Joi.bool().optional(),
  });

export default userCreateSchema;
export {userUpdateSchema};