const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const ClientIdDTO = Joi.object({
    id: Joi.objectId().required(),
});

const ClientDataDTO = Joi.object({
    nombre: Joi.string().required(),
    direccion: Joi.string().required(),
    tipo: Joi.number().integer().min(1).max(2).required(),
    nroOblea: Joi.number().integer().required(),
    responsable: Joi.string().required(),
    telefono: Joi.number().integer().required(),
});

module.exports = {
    ClientIdDTO,
    ClientDataDTO,
};
