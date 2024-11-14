const express = require('express');
const router = express.Router();

var model = require('./../model/mesaModel');


// ---------------------------------------------------------- 
// -- rutas de escucha (endpoint) dispoibles para RESERVAS -- 
// ---------------------------------------------------------- 
router.post('/', crear);
router.get('/', mostarTodo);
// router.put('/:id_reserva', modificar);
// router.delete('/cancelar/:id_reserva', cancelar);
// router.put('/finalizar/:id_reserva', finalizar);
// router.get('/buscar/:id_usuario', buscarPorIdUsuario);
// router.get('/buscar/apellido/:apellido', buscarPorApellido);
// router.get('/buscar/telefono/:nro_tel', buscarPorNroTel);


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

async function mostarTodo(req, res) {
    try {
        const mesas = await model.listarMesas();
        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


module.exports = router;