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
const Application = require('../models/application.model');

//=============================
// Importar middlewares y validaciones
//=============================
const { checkToken, checkAdmin } = require('../middlewares/jwt');

const { ClientDataDTO, ClientIdDTO } = require('../validations/client');

//=============================
// Crear Cliente
//=============================
router.post('/', [checkToken, checkAdmin], async (req, res, next) => {
    //Valido DTO
    validDTO = ClientDataDTO.validate(req.body);

    if (validDTO.error) {
        return res
            .status(400)
            .json({ ok: false, error: validDTO.error.details[0] });
    }

    const data = {
        nombre: validDTO.value.nombre,
        direccion: validDTO.value.direccion,
        tipo: validDTO.value.tipo,
        nroOblea: validDTO.value.nroOblea,
        responsable: validDTO.value.responsable,
        telefono: validDTO.value.telefono,
    };

    new Client(data).save((dbError, client) => {
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

//=============================
// Traer todos los clientes
//=============================
router.get('/', async (req, res, next) => {
    const clientes = await Client.find().lean();

    await Promise.all(
        //Traigo la ultima aplicacion si es que tiene
        await clientes.map(async (cliente, index) => {
            const application = await Application.findOne(
                {
                    cliente: cliente._id,
                },
                'fecha'
            ).sort({ fecha: -1 });

            if (application) {
                clientes[index].ultimaAplicacion = application;
            } else {
                clientes[index].ultimaAplicacion = false;
            }
        })
    );

    return res.json({ ok: true, clientes });
});

//=============================
// Traer un cliente por Id
//=============================
router.get('/:id', async (req, res, next) => {
    const validDTO = ClientIdDTO.validate(req.params);

    if (validDTO.error) {
        return res
            .status(400)
            .json({ ok: false, error: validDTO.error.details[0] });
    }

    const cliente = await Client.findById(req.params.id);

    if (!cliente) {
        return res
            .status(404)
            .json({ ok: false, error: 'No existe el cliente' });
    }

    return res.json({ ok: true, cliente });
});

//=============================
// Modificar Cliente
//=============================
router.put('/:id', [checkToken, checkAdmin], async (req, res, next) => {
    //Valido id
    let validDTO = ClientIdDTO.validate(req.params);

    if (validDTO.error) {
        return res
            .status(400)
            .json({ ok: false, error: validDTO.error.details[0] });
    }

    const id = validDTO.value.id;

    //Valido body
    validDTO = ClientDataDTO.validate(req.body);

    if (validDTO.error) {
        return res
            .status(400)
            .json({ ok: false, error: validDTO.error.details[0] });
    }

    let cliente = await Client.findById(id);

    if (!cliente) {
        return res
            .status(404)
            .json({ ok: false, error: 'No existe el cliente' });
    }

    cliente.nombre = validDTO.value.nombre;
    cliente.direccion = validDTO.value.direccion;
    cliente.tipo = validDTO.value.tipo;
    cliente.nroOblea = validDTO.value.nroOblea;
    cliente.responsable = validDTO.value.responsable;
    cliente.telefono = validDTO.value.telefono;

    cliente.save({ new: true, runValidators: true }, (error, uClient) => {
        if (error) {
            return res.status(400).json({ ok: false, error });
        }

        return res.status(202).json({ ok: true, cliente: uClient });
    });
});

module.exports = router;
