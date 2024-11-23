const express = require('express');
const router = express.Router();
const model = require('../model/usuarioModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { rulesUser, validate, personaRules } = require('../middleware/validations.js');
const verificarToken = require('./../middleware/verificarToken');

// ----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles --
// ----------------------------------------------------------
router.post('/', rulesUser(), personaRules(), validate, crear_usuario);
router.get('/', verificarToken ,listar_usuarios);          
router.put('/:id_usuario', verificarToken,rulesUser(), personaRules(), validate, modificar_usuario);  //cada usuario modifica el suyo menos el rol
router.delete('/:id_usuario', verificarToken ,eliminar_usuario);
router.get('/id/:id_usuario', verificarToken , buscarPorIdUsuario);
router.get('/apellido/:apellido', verificarToken , buscarPorApellido);
router.get('/mail/:mail', verificarToken ,buscarPorMail);
router.put('/rol/:id_usuario', verificarToken, modificarRol);   // solo puede acceder usuario con rol administrador
router.post('/login', login);


// -------------------------------------------------------------- 
// -- funciones utilizadas por el router  ----------------------- 
// --------------------------------------------------------------

async function crear_usuario(req, res) {
    try {
        const nuevo_usuario = await model.crear(req.body);
        res.status(201).json(nuevo_usuario);
    } catch (err) {
        res.status(590).json({ error: err.message });
    }
}

async function listar_usuarios(req, res) {
    try {
        const result = await model.listar();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function modificar_usuario(req, res) {
    try {
        usuario_modif = await model.modificar(req.params.id_usuario, req.body);
        res.status(200).json(usuario_modif);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function eliminar_usuario(req, res) {
    const id_usuario = parseInt(req.params.id_usuario);
    try {
        result = await model.eliminar(id_usuario);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function buscarPorIdUsuario(req, res) {
    const id_usuario = parseInt(req.params.id_usuario)
    try {
        const result = await model.buscarPorId(id_usuario);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function buscarPorMail(req, res) {
    const mail = req.params.mail;
    try {
        const result = await model.buscarPorMail(mail);
        res.status(200).json(result);
    } catch (error) {
        res.send(error.message);
    }
}

async function buscarPorApellido(req, res) {
    const ape = req.params.apellido;
    try {
        const result = await model.buscarPorApellido(ape);
        res.status(200).json(result);
    } catch (error) {
        res.send(error.message);
    }
}

async function modificarRol(req, res) {
    try {
        const id = parseInt(req.params.id_usuario);
        const usuario_modif = await model.modificarRol(req.body, id);
        res.status(200).json(usuario_modif);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


async function login(req, res) {
    try {
        const { mail, pass } = req.body;
        const [result] = await model.buscarPorMail(mail);
        const iguales = bcrypt.compareSync(pass, result.pass);
        if (iguales) {
            let user = {
                nombre: result.nombre,
                apellido: result.apellido,
                mail: result.mail
            }
            jwt.sign(user, 'ParrillaCaserezDoSantos', { expiresIn: '10000s' }, (err, token) => {
                if (err) {
                    res.status(500).send({ message: err });
                } else {
                    res.status(200).json({ datos: user, token: token });
                }
            })
        } else {
            res.status(403).send({ message: 'Contraseña Incorrecta' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports = router;


