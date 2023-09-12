import Joi from 'joi'

const deviceCreateSchema = Joi.object().keys({
  name: Joi.string().required(),
  category: Joi.string().required().valid("lamp", "lamp_rgb", "blind", "radiator", "air_conditioning", "humidity", "temperature", "pressure"),
  room_id: Joi.string().required()
});

const deviceUpdateSchema = Joi.object().keys({
  name: Joi.string().optional(),
  value: Joi.string().optional(),
});

export default deviceCreateSchema;
export { deviceUpdateSchema };