const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const UserLoginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const UserCreateDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    role: Joi.string(),
});

const UserGetDTO = Joi.object({
    id: Joi.objectId().required(),
});

module.exports = {
    UserLoginDTO,
    UserCreateDTO,
    UserGetDTO,
};
