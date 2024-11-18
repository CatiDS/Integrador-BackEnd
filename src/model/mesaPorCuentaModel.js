const db = require('../config/config_database');

metodos = {
    crearMesaPorCuenta: async function (datos) {
        const params = [datos.cuenta, datos.mesa];
        const consulta = `insert into mesa_x_cuenta (cuenta, mesa) values (?, ?)`;
        try {
            const [result] = await db.execute(consulta, params);
            return { message: 'Exito al crear mesa_por_cuenta', detail: result };
        } catch (error) {
            // if (error.code === 'ER_DUP_ENTRY') {
            //     throw new Error(`No se pudo crear la mesa_por_cuenta, el numero de mesa: ${datos.mesa} ya se encuentra cargado. ` + error.message);
            // }
            if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                throw new Error(`No se pudo crear la mesa_por_cuenta, se requieren datos que no han sido cargados. ` + error.message);
            }
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new Error('Error al crear mesa_por_cuenta, no se ha cargado una cuenta o una mesa valida. ' + error.code);
            } else {
                throw new Error('Error al crear mesa_por_cuenta ' + error.message);
            }
        }
    },

    listarTodas: async function () {                // ****VER CONDICION SI QUIERO LISTAR Y NO EXISTEN MESAS CARGADAS*****
        const consulta = `select * from mesa_x_cuenta`;
        try {
            const [result] = await db.execute(consulta);
            if (result.length == 0) {
                const error = new Error(`No existen mesas cargadas en cuentas. `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al listar cuentas: ', detail: result }
        } catch (error) {
            throw new Error('Error al listar cuentas: ' + error.message);
        }
    },

    buscarPorNroCta: async function (nro) {
        try {
            const consulta = `select * from mesa_x_cuenta where cuenta = ? `;
            const [result] = await db.execute(consulta, [nro]);
            if (result.length == 0) {
                const error = new Error(`No existe la cuenta: ${nro} o no tiene mesas asociadas.`);
                error.statusCode = 404;
                throw error;
            }
            return { message: `Exito al listar la mesas asociadas a la cuenta: ${nro}`, detail: result }
        } catch (error) {
            throw new Error('Error al listar mesas asociadas a la cuenta: ' + error.message);
        }
    },

    modificarMesaPorCuenta: async function (id, datos) {
        try {
            const params = [datos.cuenta, datos.mesa, id];
            const consulta = `update mesa_x_cuenta set cuenta = ?, mesa = ?
                                    WHERE id_mxc = ?`;
            const [result] = await db.execute(consulta, params);
            if (result.affectedRows === 0) {
                const error = new Error(`que no se ha encontrado la mesa por cuenta con el id: ${id} `);
                error.statusCode = 404;
                throw error;
            }
            if (result.changedRows === 0) {
                const error = new Error(`que los datos ingresados en la mesa por cuenta ${id} no han cambiado `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al modificar mesa por cuenta', detalle: result };
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new Error('Error al crear mesa por cuenta, no se ha cargado una cuenta o mesa valida. ' + error.code);
            }
            if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                throw new Error('No se ha modificado la mesa por cuenta, existen campos vacios que requieren datos. ' + error.message);
            }
            // if (error.code === 'ER_DUP_ENTRY') {
            //     throw new Error(`No se ha modificado la mesa por cuenta, el número de mesa ${datos.mesa} 
            //             ya esta asociada a una mesa por cuenta. ` + error.message);
            // }
            // else {
            throw new Error('No se ha modificado la mesa por cuenta debido a ' + error.message);
            // }
        }
    },

    eliminarMesaPorCuenta: async function (id) {
        try {
            const consulta = `delete from mesa_x_cuenta WHERE id_mxc = ?`;
            const [result] = await db.execute(consulta, [id]);
            if (result.affectedRows === 0) {
                const error = new Error(`No se encontro una mesa por cuenta con el id : ${id}`);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al eliminar mesa por cuenta. ', detalle: result };
        } catch (error) {
            throw new Error('Error al eliminar mesa por cuenta. ' + error.message);
        }
    },

    eliminarMesasAsociadas: async function (cuenta) {
        try {
            const consulta = `delete from mesa_x_cuenta WHERE cuenta = ?`;
            const [result] = await db.execute(consulta, [cuenta]);
                   if (result.affectedRows === 0) {
                const error = new Error(`No se encontraron mesas asociadas a la cuenta: ${cuenta},  o no existe dicha cuenta`);
                error.statusCode = 404;
                throw error;
            }
            return { message: `Exito al eliminar las mesas asociadas a la cuenta: ${cuenta}. `, detalle: result };
        } catch (error) {
            throw new Error('Error al eliminar mesas por cuenta. ' + error);
        }
    },

    cambiarEstadoDisp: async function (cuenta) {
        try {
            const consulta = `update mesa inner join mesa_x_cuenta on (mesa.id_mesa=mesa_x_cuenta.mesa)
                                set mesa.disponible = "si" where mesa_x_cuenta.cuenta = ?`;
            const [result] = await db.execute(consulta, [cuenta]);
            if (result.affectedRows === 0) {
                const error = new Error(`que no se ha encontrado mesas asociadas a la cuenta: ${cuenta} ,  o no existe dicha cuenta.`);
                error.statusCode = 404;
                throw error;
            }
            if (result.changedRows === 0) {
                const error = new Error(`que no se han cargado cambios en las mesas asociadas a la cuenta: ${cuenta} `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al cambiar la disponibilidad de la mesa', detalle: result };
        } catch (error) {
                throw new Error('No se ha modificado la disponibilidad de la mesa debido a ' + error.message);
        }
    },

}
module.exports = metodos;
