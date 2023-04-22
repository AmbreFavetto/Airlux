import Joi from 'joi'

const deviceCreateSchema = Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required().valid("actuator","sensor"),
    room_id: Joi.string().required()
  });

const deviceUpdateSchema = Joi.object().keys({
  name: Joi.string().optional(),
  type: Joi.string().optional().valid("actuator","sensor"),
  room_id: Joi.string().optional()
});

export default deviceCreateSchema;
export {deviceUpdateSchema};