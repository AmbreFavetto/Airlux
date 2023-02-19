import Joi from 'joi'

const roomCreateSchema = Joi.object().keys({
    name: Joi.string().required(),
    floor_id: Joi.string().required()
  });

const roomUpdateSchema = Joi.object().keys({
  name: Joi.string().optional(),
  floor_id: Joi.string().optional()
});

export default roomCreateSchema;
export {roomUpdateSchema};
 