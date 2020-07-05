//=============================
// Importar librerias
//=============================
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//=============================
// Importar models de Mongo
//=============================
const Application = require('../models/application.model');

//=============================
// Importar middlewares y validaciones
//=============================
const { checkToken, checkAdmin } = require('../middlewares/jwt');

const {
    ApplicationCreateDTO,
    ApplicationIdDTO,
} = require('../validations/application');

//=============================
// Crear aplicacion
//=============================
router.post('/', [checkToken, checkAdmin], async (req, res, next) => {
    const validDTO = ApplicationCreateDTO.validate(req.body);

    if (validDTO.error) {
        return res
            .status(400)
            .json({ ok: false, error: validDTO.error.details[0] });
    }

    new Application(validDTO.value).save((dbError, aplicacion) => {
        if (dbError) {
            return res
                .status(400)
                .json({ ok: false, error: dbError.errors || dbError });
        }

        if (!aplicacion) {
            return res
                .status(409)
                .json({ ok: false, error: 'No se pudo crear aplicación!' });
        }

        return res.status(201).json({ ok: true, aplicacion });
    });
});

//=============================
// Traer las aplicaciones de un cliente
//=============================
router.get('/cliente/:cliente', async (req, res, next) => {
    const validDTO = ApplicationIdDTO.validate({ id: req.params.cliente });

    if (validDTO.error) {
        return res
            .status(400)
            .json({ ok: false, error: validDTO.error.details[0] });
    }

    const aplicaciones = await Application.find({
        cliente: validDTO.value.id,
    })
    .sort({'fecha':-1})

    return res.json({ ok: true, total:aplicaciones.length, aplicaciones });
});

module.exports = router;
