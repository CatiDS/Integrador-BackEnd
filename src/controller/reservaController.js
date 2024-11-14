const express = require('express');
const router = express.Router();

var model = require('./../model/reservaModel');


// ---------------------------------------------------------- 
// -- rutas de escucha (endpoint) dispoibles para RESERVAS -- 
// ---------------------------------------------------------- 
router.get('/', mostarTodo);
router.post('/', crear);
router.put('/:id_reserva', modificar);
router.delete('/cancelar/:id_reserva', cancelar);
router.put('/finalizar/:id_reserva', finalizar);
router.get('/buscar/:id_usuario', buscarPorIdUsuario);
router.get('/buscar/apellido/:apellido', buscarPorApellido);
router.get('/buscar/telefono/:nro_tel', buscarPorNroTel);


// ----------------------------------------------------------
// --------- funciones utilizadas por el router ------------- 
// ----------------------------------------------------------

async function mostarTodo(req, res) {
    try {
        const reservas = await model.mostarTodo();
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function crear(req, res) {
    try {
        const nueva_reserva = await model.crear(req.body);
        res.status(201).json(nueva_reserva);
    } catch (error) {
        res.status(500).send(error.message)
    }
}

async function modificar(req, res) {
    try {
        const reserva_modif = await model.modificar(req.params.id_reserva,req.body);
        res.status(201).json(reserva_modif);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function cancelar(req, res) {
    const deTalReserva = parseInt(req.params.id_reserva);
    try {
        const reserva_elim = await model.cancelarReserva(deTalReserva);
          res.status(200).json( { message: reserva_elim } );
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

async function finalizar(req, res) {
    const deTalReserva =  parseInt(req.params.id_reserva);
    try {
        const finalizar_res = await model.finalizarReserva(deTalReserva);
        res.status(200).json(finalizar_res);
        
    } catch (error) {
        res.status(500).send({error: error.message})
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

async function buscarPorApellido (req, res){
    const apellido = req.params.apellido;
    // console.log(apellido);
    try {
        const result = await model.buscarPorPersona(apellido);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function buscarPorNroTel (req, res){
    const numero = parseInt(req.params.nro_tel);
    console.log(numero);
    try {
        const result = await model.buscarPorNroTel(numero);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = router;

