const db = require('../config/config_database');

metodos = {

    crear : async function (datos) {
        const params= [datos.cuenta, datos.producto, datos.cantidad, datos.observaciones, datos.subtotal, datos.cargado_por];
        const consulta = `insert into prod_x_cuenta (cuenta, producto, cantidad, observaciones, subtotal, cargado_por)
                             values (?, ?, ?, ?, ?, ?)`;
        try {
            const [result] = await db.execute(consulta, params);
            return { message: 'Exito al crear producto por cuenta.', detail: result};
        } catch (error) {
                if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                    throw new Error('Error al crear producto por cuenta, no se ha cargado una cuenta, producto o usuario valido. ' + error.message);
                }
                if (error.code === 'ER_BAD_NULL_ERROR') {
                    throw new Error('Error al modificar producto por cuenta, hay campos que no pueden ser :null ' + error.message);
                }
                if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                    throw new Error(`No se pudo crear producto por cuenta, se requieren datos que no han sido cargados. ` + error.message);
                } else {
                    throw new Error('Error al crear producto por cuenta ' + error.message);   
                }   
            }
    },
    
    listarTodos: async function (){            // ****VER CONDICION SI QUIERO LISTAR Y NO EXISTEN MESAS CARGADAS*****
        const consulta = `select * from prod_x_cuenta`;
        try {
            const [result] = await db.execute(consulta);
            if (result.length == 0) {
                const error = new Error(`No existen productos cargados en cuentas.`);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al listar productos por cuenta: ', detail: result }
        } catch (error) {
            throw new Error('Error al listar productos por cuenta: ' + error.message);
        }
    },

    modificarProdPorCuenta: async function (id, datos) {
        try {
            const params = [datos.cuenta, datos.producto, datos.cantidad, datos.observaciones, datos.subtotal, datos.cargado_por, id];
            const consulta = `update prod_x_cuenta set cuenta = ?, producto = ?, cantidad = ?, observaciones = ?, subtotal = ?, cargado_por = ?
                                WHERE id_pxc = ?`;
            const [result] = await db.execute(consulta, params);
            if (result.affectedRows === 0) {
                const error = new Error(`que no se ha encontrado producto por cuenta con el id: ${id} `);
                error.statusCode = 404;
                throw error;
            }
            if (result.changedRows === 0) {
                const error = new Error(`debido a que los datos ingresados no han cambiado `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al modificar producto por cuenta', detalle: result };
        } catch (error) {
                if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                    throw new Error('Error al modificar producto por cuenta, no se ha cargado una cuenta, producto o usuario valido. ' + error.message);
                }
                if (error.code === 'ER_BAD_NULL_ERROR') {
                    throw new Error('Error al modificar producto por cuenta, hay campos que no pueden ser :null ' + error.message);
                }
                if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                    throw new Error(`No se pudo modificar producto por cuenta, se requieren datos que no han sido cargados. ` + error.message);
                } else {
                    throw new Error('Error al modificar producto por cuenta ' + error.message);   
                }   
            }
    },

    eliminarProdPorCuenta: async function (id) {
        try {
            const consulta = `delete from prod_x_cuenta WHERE id_pxc = ?`;
            const [result] = await db.execute(consulta, [id]);
            if (result.affectedRows === 0) {
                const error = new Error(`No se encontro un producto por cuenta con el id: ${id}`);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al eliminar el producto por cuenta', detalle: result };
        } catch (error) {
            throw new Error('Error al eliminar el producto por cuenta: ' + error.message);
        }
    },

    listarPorNroCuenta: async function (nro){            // ****VER CONDICION SI QUIERO LISTAR Y NO EXISTEN MESAS CARGADAS*****
        try {
            const consulta = `select * from prod_x_cuenta where cuenta = ?`;
            const [result] = await db.execute(consulta, [nro]);
            if (result.length === 0) {
                const error = new Error(`no existe la cuenta: ${nro}, o no tiene productos cargados.`);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al listar productos por cuenta: ', detail: result }
        } catch (error) {
            throw new Error('Error al listar productos por cuenta: ' + error.message);
        }
    },

    eliminarTodosDeUnaCuenta: async function (nro) {
        try {
            const consulta = `delete from prod_x_cuenta WHERE cuenta = ?`;
            const [result] = await db.execute(consulta, [nro]);
            if (result.affectedRows === 0) {
                const error = new Error(`No se encontro productos en la cuenta: ${nro}, o no existe dicha cuenta.`);
                error.statusCode = 404;
                throw error;
            }
            return { message: `Exito al eliminar los productos de la cuenta: ${nro} `, detalle: result };
        } catch (error) {
            throw new Error('Error al eliminar los productos por cuenta: ' + error.message);
        }
    },
}
module.exports = metodos;