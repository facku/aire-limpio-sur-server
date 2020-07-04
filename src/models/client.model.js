const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const required = 'El campo {PATH} es requerido!';

ClientSchema = Schema({
  nombre: {
    type: String,
    required,
    unique: true,
  },
  direccion: {
    type: String,
    required,
  },
  tipo: {
    type: Number,
    // enum: {
    //   values: [1, 2],
    //   message: 'Valor invalido para el campo {PATH}: {VALUE}',
    // },
    required,
  },
  nroOblea: {
    type: Number,
    required,
    unique: true,
  },
  responsable: {
    type: String,
    required,
  },
  telefono: {
    type: Number,
    required,
  },
});

ClientSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

ClientSchema.plugin(uniqueValidator);

const model = mongoose.model('client', ClientSchema);

module.exports = model;
