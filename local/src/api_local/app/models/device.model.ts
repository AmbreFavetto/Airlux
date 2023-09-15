import Joi from 'joi'

const deviceCreateSchema = Joi.object().keys({
  name: Joi.string().required(),
  room_id: Joi.string().required(),
  category: Joi.string().required().valid("lamp", "lamp_rgb", "blind", "radiator", "air_conditioning", "humidity", "temperature", "pressure"),
  device_id: Joi.string().optional()
});

const deviceUpdateSchema = Joi.object().keys({
  name: Joi.string().optional(),
  value: Joi.string().optional()
});

export default deviceCreateSchema;
export { deviceUpdateSchema };