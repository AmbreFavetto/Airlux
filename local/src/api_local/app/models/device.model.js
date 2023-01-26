import Joi from 'joi'

const deviceCreateSchema = Joi.object().keys({
    name: Joi.string().required(),
    room_id: Joi.string().required()
  });

const deviceUpdateSchema = Joi.object().keys({
  name: Joi.string().optional(),
  room_id: Joi.string().optional()
});

export default deviceCreateSchema;
export {deviceUpdateSchema};