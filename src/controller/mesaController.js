const express = require('express');
const router = express.Router();

var model = require('./../model/mesaModel');


// ---------------------------------------------------------- 
// -- rutas de escucha (endpoint) dispoibles para RESERVAS -- 
// ---------------------------------------------------------- 
router.post('/', crear);
router.get('/', listarMesas);
router.put('/:id_mesa', modificar);
router.delete('/:id_mesa', cancelar);
router.put('/cambiareEstado/disponible/:id_mesa', disponible);
router.put('/cambiareEstado/noDisponible/:id_mesa', noDisponible);
router.get('/buscar/:nro_mesa', buscarPorNroMesa);
router.get('/mesasDisponibles', listarMesasDisponibles);


// ----------------------------------------------------------
// --------- funciones utilizadas por el router ------------- 
// ----------------------------------------------------------

async function crear(req, res) {
    try {
        const nueva_mesa = await model.crear(req.body);
        res.status(201).json(nueva_mesa);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function listarMesas(req, res) {
    try {
        const mesas = await model.listarMesas();
        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function modificar(req, res) {
    try {
        const mesa_modif = await model.modificarMesa(req.params.id_mesa,req.body);
        res.status(201).json(mesa_modif);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function cancelar(req, res) {
    const id = parseInt(req.params.id_mesa);
    try {
        const result = await model.cancelarMesa(id);
          res.status(200).json( { message: result } );
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

async function disponible(req, res) {
    try {
        const id =  parseInt(req.params.id_mesa);
        const result = await model.disponible(id);
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).send({error: error.message})
    }
}

async function noDisponible(req, res) {
    try {
        const id =  parseInt(req.params.id_mesa);
        const result = await model.noDisponible(id);
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).send({error: error.message})
    }
}


async function buscarPorNroMesa(req, res) {
    const nro_mesa = parseInt(req.params.nro_mesa)
    try {
        const result = await model.buscarPorNroMesa(nro_mesa);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function listarMesasDisponibles(req, res) {
    try {
        const mesas = await model.listarMesasDisponibles();
        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).send(error.message);
    }
}



module.exports = router;