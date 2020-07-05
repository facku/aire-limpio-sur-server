const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const ApplicationIdDTO = Joi.object({
    id: Joi.objectId().required(),
});

const ApplicationCreateDTO = Joi.object({
    cliente: Joi.objectId().required(),
    fecha: Joi.date(),
});

module.exports = {
    ApplicationIdDTO,
    ApplicationCreateDTO,
};
