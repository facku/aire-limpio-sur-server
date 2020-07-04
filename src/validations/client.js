const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const ClientCreateDTO = Joi.object({
  nombre: Joi.string().required(),
  direccion: Joi.string().required(),
  tipo: Joi.number().integer().min(1).max(2).required(),
  nroOblea: Joi.number().integer().required(),
  responsable: Joi.string().required(),
  telefono: Joi.number().integer().required(),
});

const ClientGetDTO = Joi.object({
  id: Joi.objectId().required(),
});
// ClientCreateDTO, ClientGetDTO

module.exports = {
  ClientCreateDTO,
  ClientGetDTO,
};
