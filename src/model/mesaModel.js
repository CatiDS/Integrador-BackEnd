const db = require('../config/config_database');

metodos = {

    crear : async function (datos) {
        const params= [datos.nro_mesa, datos.lugares];
        const consulta = `insert into mesa ( nro_mesa, lugares) values (?, ?)`;
        try {
            const [result] = await db.execute(consulta, params);
            return { message: 'Exito al crear mesa', detail: result};
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error(`No se pudo crear la mesa, el numero de mesa: ${datos.nro_mesa} ya se encuentra cargado. ` + error.message);
            } else {
                if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                    throw new Error(`No se pudo crear la mesa, se requieren datos que no han sido cargados. ` + error.message);
                } else {
                    throw new Error('Error al crear mesa ' + error.message);   
                }   
            }
        }
    },

    listarMesas: async function () {                // ****VER CONDICION SI QUIERO LISTAR Y NO EXISTEN MESAS CARGADAS*****
        const consulta = `select * from mesa`;
        try {
            const [result] = await db.execute(consulta);
            return { message: 'Exito al listar mesas: ', detail: result }
        } catch (error) {
            throw new Error('Error al listar mesas: ' + error.message);
        }
    },

    modificarMesa: async function (id, datos) {
        try {
            const params = [datos.nro_mesa, datos.lugares, datos.disponible, id];
            const consulta = `update mesa set nro_mesa = ?, lugares = ?, disponible = ?
                                WHERE id_mesa = ?`;
            const [result] = await db.execute(consulta, params);
            if (result.affectedRows === 0) {
                const error = new Error(`que no se ha encontrado la mesa con el id: ${id} `);
                error.statusCode = 404;
                throw error;
            }
            if (result.changedRows === 0) {
                const error = new Error(`que los datos ingresados en la mesa ${id} no han cambiado `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al modificar mesa', detalle: result };
        } catch (error) {
            if (error.code === 'WARN_DATA_TRUNCATED') {
                throw new Error('No se ha modificado la mesa, la disponibilidad debe ser: "si" o "no".' + error.message);
            } 
            if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                throw new Error('No se ha modificado la mesa, existen campos vacios que requieren datos. ' + error.message);
            }
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error(`No se ha modificado la mesa, el número de mesa: ${datos.nro_mesa} ya existe ` + error.message);
            } 
            else {
                throw new Error('No se ha modificado la mesa debido a ' + error.message);
            }
        }
    },


    cancelarMesa: async function (id) {
        try {
            const consulta = `delete from mesa WHERE id_mesa = ?`;
            const [result] = await db.execute(consulta, [id]);
            console.log(result.affectedRows);
            console.log(id);
            if (result.affectedRows === 0) {
                const error = new Error(`No se encontro una mesa con el id_mesa: ${id}`);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al cancelar la mesa', detalle: result };
        } catch (error) {
            throw new Error('Error al cancelar la mesa: ' + error.message);
        }
    },

    disponible: async function (id) {
        try {
            const consulta = `update mesa set disponible = "si" where id_mesa = ?`;
            const [result] = await db.execute(consulta, [id]);
            console.log(result.affectedRows);
            console.log(id);
            if (result.affectedRows === 0) {
                const error = new Error(`que no se ha encontrado la mesa con el id: ${id} `);
                error.statusCode = 404;
                throw error;
            }
            if (result.changedRows === 0) {
                const error = new Error(`que no se han cargado cambios en la mesa con id_mesa: ${id} `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al cambiar la disponibilidad de la mesa', detalle: result };
        } catch (error) {
                throw new Error('No se ha modificado la disponibilidad de la mesa debido a ' + error.message);
        }
    },

    noDisponible: async function (id) {
        try {
            const consulta = `update mesa set disponible = "no" where nro_mesa = ?`;
            const [result] = await db.execute(consulta, [id]);
            if (result.affectedRows === 0) {
                const error = new Error(`que no se ha encontrado la mesa con el id: ${id} `);
                error.statusCode = 404;
                throw error;
            }
            if (result.changedRows === 0) {
                const error = new Error(`que no se han cargado cambios en la mesa con id_mesa: ${id} `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al cambiar la disponibilidad de la mesa', detalle: result };
        } catch (error) {
                throw new Error('No se ha modificado la disponibilidad de la mesa debido a ' + error.message);
        }
    },

    buscarPorNroMesa: async function (id) {
        try {
            const consulta = `select * from mesa where nro_mesa = ? `;
            const [result] = await db.execute(consulta, [id]);
            if (result == "") {
                const error = new Error(`No existe la mesa: ${id}. `);
                error.statusCode = 404;
                throw error;
            }
            console.log(result);
            return { message: `Exito al listar la mesa: ${id}`, detail: result }
        } catch (error) {
            throw new Error('Error al listar: ' + error.message);
        }
    },

    listarMesasDisponibles: async function () {
        const consulta = `select * from mesa where disponible = "si"`;
        try {
            const [result] = await db.execute(consulta);
            return { message: 'Exito al listar mesas: ', detail: result }
        } catch (error) {
            throw new Error('Error al listar mesas: ' + error.message);
        }

    }

}
module.exports = metodos;
// model vehiculo se encargara de conectarse a la base de datos y devolver informacion al controller.