import Joi from 'joi'

const deviceSchema = Joi.object().keys({
    name: Joi.string().required(),
    room_id: Joi.string().regex(/^rooms:[0-9]+/).required()
  });

export default deviceSchema;