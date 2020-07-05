//=============================
// Importar librerias
//=============================
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//=============================
// Importar models de Mongo
//=============================
const User = require('../models/user.model');

//=============================
// Importar middlewares y validaciones
//=============================
const { checkToken, checkAdmin } = require('../middlewares/jwt');

const {
    UserLoginDTO,
    UserCreateDTO,
    UserGetDTO,
} = require('../validations/user');

//=============================
// Login User
//=============================
router.post('/login', async (req, res, next) => {
    // //Si es password esta vacio lanzo un error, cambiar esto con Joi
    // if (req.body.password === '') {
    //   return next(new Error('El password no puede estar vacio!'));
    // }
    //Valido DTO
    validDTO = UserLoginDTO.validate(req.body);

    if (validDTO.error) {
        return res
            .status(400)
            .json({ ok: false, error: validDTO.error.details[0] });
    }

    const email = validDTO.value.email;
    const password = validDTO.value.password;

    // Busco usuario en DB
    const user = await User.findOne({ email });

    //Si no existe el user lanzo error
    if (!user) {
        return res.status(404).json({
            ok: false,
            error: `No existe ningun usuario con el email '${email}'`,
        });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (passwordMatch) {
        // User logueado
        const token = jwt.sign(
            {
                sub: user.id,
                user: {
                    email: user.email,
                    nombre: user.nombre,
                    role: user.role,
                },
            },
            process.env.JWT_SEED,
            { expiresIn: process.env.JWT_EXP }
        );
        return res.json({ ok: true, token, user });
    } else {
        // Login failed
        return res
            .status(401)
            .json({ ok: false, error: 'Email o Password incorrectos!' });
    }
});

//=============================
// Crear User
//=============================
router.post('/', [checkToken, checkAdmin], async (req, res, next) => {
    //Valido DTO
    validDTO = UserCreateDTO.validate(req.body);

    if (validDTO.error) {
        return res
            .status(400)
            .json({ ok: false, error: validDTO.error.details[0] });
    }

    //Asigno valores para guardar en mongo
    const password = bcrypt.hashSync(validDTO.value.password, 10);
    const email = validDTO.value.email;
    const nombre = validDTO.value.nombre;
    const apellido = validDTO.value.apellido;
    const role = validDTO.value.role || 'Inspector';

    //=============================
    // Creo el usuario en DB
    //=============================
    let user = await new User({ email, password, nombre, apellido, role }).save(
        (dbError, user) => {
            if (dbError) {
                return res
                    .status(400)
                    .json({ ok: false, error: dbError.errors || dbError });
            }

            if (!user) {
                return res
                    .status(409)
                    .json({ ok: false, error: 'No se pudocrear el usuario!' });
            }

            return res.status(201).json({ ok: true, user });
        }
    );
});

//=============================
// Traer todos los usuarios
//=============================
router.get('/', [checkToken, checkAdmin], async (req, res, next) => {
    const users = await User.find();

    return res.json({ ok: true, users });
});

//=============================
// Traer un usuario por ID
//=============================
router.get('/:id', [checkToken, checkAdmin], async (req, res, next) => {
    validDTO = UserGetDTO.validate(req.params);

    if (validDTO.error) {
        return res
            .status(400)
            .json({ ok: false, error: validDTO.error.details[0] });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return res
            .status(404)
            .json({ ok: false, error: 'No existe el usuario' });
    }

    return res.json({ ok: true, user });
});

module.exports = router;
