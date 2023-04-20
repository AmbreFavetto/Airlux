import Joi from 'joi'

const deviceCreateSchema = Joi.object().keys({
  name: Joi.string().required(),
  category: Joi.string().required().valid("lamp", "lamp rgb", "pane", "radiator", "air_conditioning"),
  room_id: Joi.string().required()
});

const deviceUpdateSchema = Joi.object().keys({
  name: Joi.string().optional(),
  category: Joi.string().optional().valid("lamp", "lamp rgb", "pane", "radiator", "air_conditioning"),
  value: Joi.number().optional(),
  room_id: Joi.string().optional()
});

export default deviceCreateSchema;
export { deviceUpdateSchema };