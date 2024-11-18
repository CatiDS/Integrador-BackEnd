const express = require('express');
const router = express.Router();

var model = require('./../model/cuentaModel');

// ---------------------------------------------------------- 
// -- rutas de escucha (endpoint) dispoibles-- 
// ---------------------------------------------------------- 
router.post('/', crearCuenta);
router.get('/', listarCuentas);
router.put('/:id_cuenta', modificarCuenta);
router.delete('/:id_cuenta', eliminarCuenta);
router.get('/buscar/:nro_mesa', buscarPorNroMesa);

// ----------------------------------------------------------
// --------- funciones utilizadas por el router ------------- 
// ----------------------------------------------------------

async function crearCuenta(req, res) {
    try {
        const nueva_cuenta = await model.crearCuenta(req.body);
        res.status(201).json(nueva_cuenta);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function listarCuentas(req, res) {
    try {
        const mesas = await model.listarCuentas();
        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function modificarCuenta(req, res) {
    try {
        const cuenta_modif = await model.modificarCuenta(req.params.id_cuenta,req.body);
        res.status(201).json(cuenta_modif);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function eliminarCuenta(req, res) {
    const id = parseInt(req.params.id_cuenta);
    try {
        const result = await model.eliminarCuenta(id);
          res.status(200).json( { message: result } );
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

async function buscarPorNroMesa(req, res) {
    const nro= parseInt(req.params.nro_mesa)
    try {
        const result = await model.buscarPorNroMesa(nro);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = router;
    