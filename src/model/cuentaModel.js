const db = require('../config/config_database');

metodos = {
    crearCuenta: async function (datos) {
        const params = [datos.reserva, datos.mesa];
        const consulta = `insert into cuenta (reserva, mesa) values (?, ?)`;
        try {
            const [result] = await db.execute(consulta, params);
            return { message: 'Exito al crear cuenta', detail: result };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error(`No se pudo crear la cuenta, el numero de reserva: ${datos.reserva} ya se encuentra cargado. ` + error.message);
            }
            if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                throw new Error(`No se pudo crear la cuenta, se requieren datos que no han sido cargados. ` + error.message);
            }
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new Error('Error al crear cuenta, no se ha cargado una reserva valida. ' + error.code);
            } else {
                throw new Error('Error al crear cuenta ' + error.message);
            }
        }
    },

    listarCuentas: async function () {                // ****VER CONDICION SI QUIERO LISTAR Y NO EXISTEN MESAS CARGADAS*****
        const consulta = `select * from cuenta`;
        try {
            const [result] = await db.execute(consulta);
            return { message: 'Exito al listar cuentas: ', detail: result }
        } catch (error) {
            throw new Error('Error al listar cuentas: ' + error.message);
        }
    },

    modificarCuenta: async function (id, datos) {
        try {
            const params = [datos.reserva, datos.mesa, id]; 
            const consulta = `update cuenta set reserva = ?, mesa = ?
                                WHERE id_cuenta = ?`;
            const [result] = await db.execute(consulta, params);
            if (result.affectedRows === 0) {
                const error = new Error(`que no se ha encontrado la cuenta con el id: ${id} `);
                error.statusCode = 404;
                throw error;
            }
            if (result.changedRows === 0) {
                const error = new Error(`que los datos ingresados en la cuenta ${id} no han cambiado `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al modificar cuenta', detalle: result };
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new Error('Error al crear cuenta, no se ha cargado una reserva valida. ' + error.code);
            } 
            if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                throw new Error('No se ha modificado la cuenta, existen campos vacios que requieren datos. ' + error.message);
            }
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error(`No se ha modificado la cuenta, el número de reserva ${datos.reserva} 
                    ya esta asociada a una cuenta. ` + error.message);
            } 
            else {
                throw new Error('No se ha modificado la cuenta debido a ' + error.message);
            }
        }
    },

    eliminarCuenta: async function (id) {
        try {
            const consulta = `delete from cuenta WHERE id_cuenta = ?`;
            const [result] = await db.execute(consulta, [id]);
            if (result.affectedRows === 0) {
                const error = new Error(`No se encontro una cuenta con el id_cuenta: ${id}`);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al eliminar la cuenta', detalle: result };
        } catch (error) {
            throw new Error('Error al eliminar la cuenta: ' + error.message);
        }
    },

    buscarPorNroMesa: async function (nro) {
        try {
            const consulta = `select * from cuenta where mesa = ? `;
            const [result] = await db.execute(consulta, [nro]);
            if (result.length == 0) {
                const error = new Error(`No se encontró la mesa: ${nro} asociada a una cuenta, o no existe dicha mesa. `);
                error.statusCode = 404;
                throw error;
            }
            return { message: `Exito al listar la mesa: ${nro}`, detail: result }
        } catch (error) {
            throw new Error('Error al listar: ' + error.message);
        }
    },

}
module.exports = metodos;