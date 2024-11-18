const express = require('express');
const router = express.Router();

var model = require('./../model/mesaPorCuentaModel');


// // ---------------------------------------------------------- 
// // -- rutas de escucha (endpoint) dispoibles -- 
// // ---------------------------------------------------------- 
router.post('/',  crearMesaPorCuenta);
router.get('/', listarTodas);
router.put('/:id_mxc', modificarMesaPorCuenta);
router.get('/nro_cuenta/:cuenta', buscarPorNroCta);
router.delete('/:id_mxc', eliminarMesaPorCuenta);
router.delete('/eliminar/:cuenta', eliminarMesasAsociadas); //eliminar todas las mesas asociadas a una cuenta (al aeliminar cuenta)
router.put('/bajaMesas/:cuenta', cambiarEstadoDisp);

// // ----------------------------------------------------------
// // --------- funciones utilizadas por el router ------------- 
// // ----------------------------------------------------------

async function crearMesaPorCuenta(req, res) {
    try {
        const nva_mesaxcta = await model.crearMesaPorCuenta(req.body);
        res.status(201).json(nva_mesaxcta);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function listarTodas(req, res) {
    try {
        const mesas = await model.listarTodas();
        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function buscarPorNroCta(req, res) {
    const nro= parseInt(req.params.cuenta)
    try {
        const result = await model.buscarPorNroCta(nro);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function modificarMesaPorCuenta(req, res) {
    try {
        const cuenta_modif = await model.modificarMesaPorCuenta(req.params.id_mxc,req.body);
        res.status(201).json(cuenta_modif);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function eliminarMesaPorCuenta(req, res) {
    const id = parseInt(req.params.id_mxc);
    try {
        const result = await model.eliminarMesaPorCuenta(id);
          res.status(200).json( { message: result } );
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

async function eliminarMesasAsociadas(req, res) {
    const cuenta = parseInt(req.params.cuenta);
    try {
        const result = await model.eliminarMesasAsociadas(cuenta);
          res.status(200).json( { message: result } );
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

async function cambiarEstadoDisp(req, res) {                    //cambiar el estado de las mesas asociadas a una cuenta
    try {                                                       //hacerlo en front cuando se finalice una cuenta
        const cuenta =  parseInt(req.params.cuenta);
        const result = await model.cambiarEstadoDisp(cuenta);
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).send({error: error.message})
    }
}

module.exports = router;