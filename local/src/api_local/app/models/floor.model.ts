import Joi from 'joi'

const floorCreateSchema = Joi.object().keys({
    name: Joi.string().required(),
    building_id: Joi.string().required()
  });

const floorUpdateSchema = Joi.object().keys({
  name: Joi.string().optional(),
  building_id: Joi.string().optional()
});

export default floorCreateSchema;
export {floorUpdateSchema};
 