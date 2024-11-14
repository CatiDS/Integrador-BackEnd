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
                if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
                    throw new Error(`No se pudo crear la mesa, se requieren datos que no han sido cargados. ` + error.message);
                } else {
                    throw new Error('Error al crear mesa ' + error.message);   
                }   
            }
        }
    },

    listarMesas: async function () {                // VER CONDICION SI QUIERO LISTAR Y NO EXISTEN MESAS CARGADAS*****
        const consulta = `select * from mesa`;
        try {
            const [result] = await db.execute(consulta);
            return { message: 'Exito al listar mesas: ', detail: result }
        } catch (error) {
            throw new Error('Error al listar mesas: ' + error.message);
        }

        
    }
    // mostarTodo: async function () {
    //     try {
    //         const consulta = `select reserva.id_reserva, concat (reserva.apellido,", ", reserva.nombre) as nombre_cliente, 
    //         reserva.fecha_res as fecha_reserva, reserva.nro_tel, reserva.cant_personas , reserva.estado, 
    //         concat (usuario.apellido,", ", usuario.nombre) as nombre_usuario,  reserva.fecha_hoy as fecha_carga
    //         from usuario inner join reserva on( usuario.id_usuario = reserva.usuario_res) order by nombre_cliente ;`
    //         const [result] = await db.execute(consulta);
    //         return { message: 'Exito al listar reservas', detail: result }
    //     } catch (error) {
    //         throw new Error('Error al listar reservas: ' + error.message);
    //     }
    // },



}
module.exports = metodos;
// model vehiculo se encargara de conectarse a la base de datos y devolver informacion al controller.