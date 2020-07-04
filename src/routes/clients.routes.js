//=============================
// Importar librerias
//=============================
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//=============================
// Importar models de Mongo
//=============================
const Client = require('../models/client.model');

//=============================
// Importar middlewares y validaciones
//=============================
const { checkToken, checkAdmin } = require('../middlewares/jwt');

const { ClientCreateDTO, ClientGetDTO } = require('../validations/client');

//=============================
// Crear Cliente
//=============================
router.post('/', [checkToken, checkAdmin], async (req, res, next) => {
  //Valido DTO
  validDTO = ClientCreateDTO.validate(req.body);

  if (validDTO.error) {
    return res
      .status(400)
      .json({ ok: false, error: validDTO.error.details[0] });
  }

  const nombre = validDTO.value.nombre;
  const direccion = validDTO.value.direccion;
  const tipo = validDTO.value.tipo;
  const nroOblea = validDTO.value.nroOblea;
  const responsable = validDTO.value.responsable;
  const telefono = validDTO.value.telefono;

  new Client({
    nombre,
    direccion,
    tipo,
    nroOblea,
    responsable,
    telefono,
  }).save((dbError, client) => {
    if (dbError) {
      return res
        .status(400)
        .json({ ok: false, error: dbError.errors || dbError });
    }

    if (!client) {
      return res
        .status(409)
        .json({ ok: false, error: 'No se pudocrear el Cliente!' });
    }

    return res.status(201).json({ ok: true, client });
  });
});

module.exports = router;
