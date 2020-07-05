const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const required = 'El campo {PATH} es requerido!';

ApplicationSchema = Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        required,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
});

ApplicationSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.cliente;
        delete ret.__v;
        return ret;
    },
};

const model = mongoose.model('application', ApplicationSchema);

module.exports = model;