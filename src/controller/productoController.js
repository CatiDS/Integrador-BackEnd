const express = require('express');
const router = express.Router();

var model = require('./../model/productoModel');
const { validate, prodControl } = require('../middleware/validations.js');

 
// // // ---------------------------------------------------------- 
// // // -- rutas de escucha (endpoint) dispoibles -- 
// // // ---------------------------------------------------------- 
router.post('/', prodControl(), validate, crear);
router.get('/', listarTodos);
router.put('/:id_prod', prodControl(), validate, modificarProd);
router.delete('/:id_prod', eliminarProd);
router.get('/categoria/:categoria', listarPorcategoria);
// router.delete('/eliminar/:cuenta', eliminarTodosDeUnaCuenta);

// // // ----------------------------------------------------------
// // // --------- funciones utilizadas por el router ------------- 
// // // ----------------------------------------------------------

async function crear(req, res) {
    try {
        const nuevo = await model.crear(req.body);
        res.status(201).json(nuevo);
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

async function modificarProd(req, res) {
    try {
        const modificado = await model.modificarProd(req.params.id_prod,req.body);
        res.status(201).json(modificado);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function eliminarProd(req, res) {
    const id = parseInt(req.params.id_prod);
    try {
        const result = await model.eliminarProd(id);
          res.status(200).json( { message: result } );
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

async function listarPorcategoria(req, res) {
    try {
        const productos = await model.listarPorcategoria(req.params.categoria);
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = router;