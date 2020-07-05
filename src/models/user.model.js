const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const required = 'El campo {PATH} es requerido!';

const UserSchema = Schema({
    email: {
        type: String,
        required,
        unique: true,
    },
    password: {
        type: String,
        required,
    },
    nombre: {
        type: String,
        required,
    },
    apellido: {
        type: String,
        required,
    },
    role: {
        type: String,
        enum: {
            values: ['Inspector', 'Admin'],
            default: 'Inspector',
            message: 'Valor invalido para el campo {PATH}: {VALUE}',
        },
    },
});

UserSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
};

UserSchema.plugin(uniqueValidator);

const model = mongoose.model('user', UserSchema);

module.exports = model;
