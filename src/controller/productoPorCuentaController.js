const express = require('express');
const router = express.Router();
var model = require('./../model/productoPorCuentaModel');
const verificarToken = require('./../middleware/verificarToken');
 
// // ---------------------------------------------------------- 
// // -- rutas de escucha (endpoint) dispoibles -- 
// // ---------------------------------------------------------- 
router.post('/', verificarToken ,crear);
router.get('/', verificarToken ,listarTodos);
router.put('/:id_pxc', verificarToken ,modificarProdPorCuenta);
router.delete('/:id_pxc', verificarToken ,eliminarProdPorCuenta);
router.get('/nro_cuenta/:cuenta', verificarToken ,listarPorNroCuenta);
router.delete('/eliminar/:cuenta', verificarToken ,eliminarTodosDeUnaCuenta);

// // ----------------------------------------------------------
// // --------- funciones utilizadas por el router ------------- 
// // ----------------------------------------------------------

async function crear(req, res) {
    try {
        const nuevo_pxc = await model.crear(req.body);
        res.status(201).json(nuevo_pxc);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function listarTodos(req, res) {
    try {
        const mesas = await model.listarTodos();
        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function modificarProdPorCuenta(req, res) {
    try {
        const modificado = await model.modificarProdPorCuenta(req.params.id_pxc,req.body);
        res.status(201).json(modificado);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function eliminarProdPorCuenta(req, res) {
    const id = parseInt(req.params.id_pxc);
    try {
        const result = await model.eliminarProdPorCuenta(id);
          res.status(200).json( { message: result } );
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

async function listarPorNroCuenta(req, res) {
    try {
        const nro = parseInt(req.params.cuenta);
        const mesas = await model.listarPorNroCuenta(nro);
        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function eliminarTodosDeUnaCuenta(req, res) {
    const cuenta = parseInt(req.params.cuenta);
    try {
        const result = await model.eliminarTodosDeUnaCuenta(cuenta);
          res.status(200).json( { message: result } );
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

module.exports = router;