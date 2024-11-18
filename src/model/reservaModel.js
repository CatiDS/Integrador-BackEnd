const db = require('../config/config_database');

metodos = {

     crear: async function (datos) {
        try {
            const params = [datos.fecha_res, datos.usuario_res, datos.apellido, datos.nombre, datos.nro_tel, datos.cant_personas];
            const consulta = `insert into reserva ( fecha_res, usuario_res , apellido , nombre, nro_tel, cant_personas)
                                 VALUES (?, ?, ?, ?, ?, ?)`;
            const result = await db.execute(consulta, params);
            return { message: 'Exito al crear reserva', detalle: result };
        } catch (error) {
            if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
                throw new Error('No se pudo realizar la reserva, existen datos requeridos que no han sido cargados.' + error.message);
            } else
                if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                    throw new Error(`No se pudo realizar la reserva, debe ingresar el id_usuario que realiza la carga. ` + error.message);
                } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                    throw new Error(`No se pudo realizar la reserva, el id_usuario:  ${datos.usuario_res} que realiza la carga no se encuentra en la base de datos: ` + error.message);
                } else {
                    throw new Error('No se pudo realizar la reserva debido a: ' + error);
                }
        }
    },

    mostarTodo: async function () {
        try {
            const consulta = `select reserva.id_reserva, reserva.apellido, reserva.nombre, 
            reserva.fecha_res, reserva.nro_tel, reserva.cant_personas , reserva.estado, 
            usuario.apellido, usuario.nombre, reserva.fecha_hoy as fecha_carga
            from usuario inner join reserva on( usuario.id_usuario = reserva.usuario_res);`
            const [result] = await db.execute(consulta);
            return { message: 'Exito al listar reservas', detail: result }
        } catch (error) {
            throw new Error('Error al listar reservas: ' + error.message);
        }
    },

    modificar: async function (id, datos) {
        try {
            const params = [datos.fecha_res, datos.apellido, datos.nombre, datos.nro_tel, datos.cant_personas, id];
            const consulta = `update reserva set fecha_res = ?, apellido = ?, nombre = ?, nro_tel = ?, cant_personas = ?
                                WHERE id_reserva = ?`;
            const [result] = await db.execute(consulta, params);
            if (result.affectedRows === 0) {
                const error = new Error(`que no se ha encontrado la reserva con el id: ${id} `);
                error.statusCode = 404;
                throw error;
            }
            if (result.changedRows === 0) {
                const error = new Error(`que los datos ingresados en la reserva ${id} no han cambiado `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al modificar reserva', detalle: result };
        } catch (error) {
            if (error.code === 'ER_WRONG_ARGUMENTS') {
                throw new Error('No se ha modificado la reserva. La columna no puede ser nula: ' + error.code);
            } else if (error.code === 'ER_NO_REFERENCED_ROW') {
                throw new Error(' Falla en la restricción de clave externa.: ' + error.message);
            } else {
                throw new Error('No se ha modificado la reserva debido a ' + error.message);
            }
        }
    },

    cancelarReserva: async function (deTalReserva) {
        try {
            const consulta = `delete from reserva WHERE id_reserva = ?`;
            const [result] = await db.execute(consulta, [deTalReserva]);
            if (result.affectedRows === 0) {
                const error = new Error(`No se encontro una reserva con el id_reserva: ${deTalReserva}`);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al cancelar la reserva', detalle: result };
        } catch (error) {
            throw new Error('Error al cancelar la reserva: ' + error.message);
        }
    },


    finalizarReserva: async function (deTalReserva) {
        try {
            const consulta = `update reserva set estado = 'finalizada' where id_reserva = ?`;
            const [result] = await db.execute(consulta, [deTalReserva]);
            if (result.affectedRows === 0) {
                const error = new Error(`que no se ha encontrado la reserva con el id: ${deTalReserva} `);
                error.statusCode = 404;
                throw error;
            }
            if (result.changedRows === 0) {
                const error = new Error(`que la reserva con id_reserva ${deTalReserva} no estaba activa `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al finalizar la reserva', detalle: result };
        } catch (error) {
                      throw new Error('No se ha modificado la reserva debido a ' + error.message);
        }
    },

    buscarPorId: async function (id) {
        try {
            const consulta = `select reserva.id_reserva, reserva.apellido, reserva.nombre, 
            reserva.fecha_res , reserva.nro_tel, reserva.cant_personas , reserva.estado, 
            usuario.apellido, usuario.nombre,  reserva.fecha_hoy as fecha_carga
            from usuario inner join reserva on( usuario.id_usuario = reserva.usuario_res) 
            where usuario.id_usuario= ?`; 
            const [result] = await db.execute(consulta, [id]);
            if (result.length == 0) {
                const error = new Error(`El usuario con el id: ${id} no tiene reservas, o no existe. `);
                error.statusCode = 404;
                throw error;
            }
            return { message: `Exito al listar reservas del usuario: ${id}`, detail: result }
        } catch (error) {
            throw new Error('Error al listar reservas: ' + error.message);
        }
    },

    buscarPorPersona: async function (apellido) {
        try {
            const consulta = `select reserva.id_reserva, reserva.apellido, reserva.nombre, 
            reserva.fecha_res, reserva.nro_tel, reserva.cant_personas , 
            usuario.apellido, usuario.nombre,  reserva.fecha_hoy as fecha_carga
            from usuario inner join reserva on( usuario.id_usuario = reserva.usuario_res) 
            where reserva.apellido = ?`;
            const [result] = await db.execute(consulta, [apellido]);
            if (result.length == 0) {
                const error = new Error(`El cliente ${apellido} no tiene reservas, o no existe. `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al listar reservas', detail: result }
        } catch (error) {
            throw new Error('Error al listar reservas: ' + error.message);
        }
    },

    buscarPorNroTel: async function (numero) {
        try {
            const consulta = `select reserva.id_reserva, reserva.apellido, reserva.nombre, 
            reserva.fecha_res, reserva.nro_tel, reserva.cant_personas , 
            usuario.apellido, usuario.nombre,  reserva.fecha_hoy as fecha_carga
            from usuario inner join reserva on( usuario.id_usuario = reserva.usuario_res) where reserva.nro_tel = ?`;
            const [result] = await db.execute(consulta,[numero]);
            if (result.length == 0) {
                const error = new Error(`El número de telefono ${numero} no tiene reservas, o no existe. `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al listar reservas', detail: result }
        } catch (error) {
            throw new Error('Error al listar reservas: ' + error.message);
        }
    }
}

module.exports = metodos;
// model vehiculo se encargara de conectarse a la base de datos y devolver informacion al controller.