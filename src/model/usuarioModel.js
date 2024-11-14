const db = require('../config/config_database');
const bcrypt = require('bcrypt');


const Usuario = {

    //registrarse como usuario
    crear: async (datos) => {
        const hashedPass = await bcrypt.hash(datos.pass, 10); // Hasheamos la contraseña y reemplazamos pass por hashedPass
        //let textoHashed = bcrypt.hashSync("texto a encriptar",10);
        try {
            const params = [datos.apellido, datos.nombre, datos.mail, hashedPass, datos.nro_tel];
            const consulta = 'insert into usuario ( apellido, nombre, mail, pass, nro_tel) values (?, ?, ?, ?, ?)';
            const [result] = await db.execute(consulta, params);
            return { message: `Usuario ${datos.mail} creado con exito`, detail: result };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('No se pudo registrar al usuario. Existe un usuario con los mismos datos: ' + error.message);
            } else if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {                   /* (error.code === 'ER_BAD_NULL_ERROR')  La columna no puede ser nula:*/
                throw new Error('No se pudo registrar al usuario. Se requieren datos que no han sido mandados : ' + error.message);
            } else /* if (error.code === 'ER_NO_REFERENCED_ROW') {
                throw new Error(' Falla en la restricción de clave externa.: ' + error.message);
            } else */ {
                throw new Error('No se pudo registrar al usuario debido a: ' + error.message);

            }
        }
    },                      //ER_WRONG_VALUE_COUNT_ON_ROW

    listar : async () => {
        const consulta = `select id_usuario, concat (apellido, ", ", nombre) as Nombre_Apellido, mail, nro_tel as Numero_telefono, rol from usuario;`;
        try {
            const [rows] = await db.execute(consulta);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener los usuarios: ' + error.message);
        }
    },

    modificar: async (id, datos) => {
        const hashedPass = await bcrypt.hash(datos.pass, 10);
        const params= [datos.apellido, datos.nombre, datos.mail, hashedPass, datos.nro_tel, id]; 
        const consulta = `update usuario set apellido = ?, nombre = ?,
         mail = ?, pass = ?, nro_tel = ? WHERE id_usuario = ?;`;
         try {
            const [result] = await db.execute(consulta , params );
            return {message :'Exito al modificar el usuario. ', detalle: result }
        } catch (error) {
            throw new Error('Error al modificar el usuario: ' + error.message);
        }
    },

    eliminar: async function (id) {
        try {
            const consulta = `delete from usuario where id_usuario = ? `;
            const [result] = await db.execute(consulta, [id]);
            if (result.affectedRows === 0) {
                const error = new Error(`No se encontro el usuario con el id_usuario: ${id}`);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al eliminar el usuario.', detalle: result }
        } catch (error) {
            throw new Error('Error al eliminar el usuario : ' + error.message);
        }
    },

    buscarPorId: async function (id) {
        try {
            const consulta = `select concat (apellido, ", ", nombre) as Nombre_Apellido, mail,
             nro_tel as Numero_telefono, rol from usuario where id_usuario = ?`;
            const [result] = await db.execute(consulta, [id]);
            if (result == "") {
                const error = new Error(`El usuario con el id: ${id} no existe. `);
                error.statusCode = 404;
                throw error;
            }
            console.log(result);
            return { message: `Exito al buscar al usuario: ${id}`, detail: result }
        } catch (error) {
            throw new Error('Error al buscar al usuario: ' + error.message);
        }
    },

  
    buscarPorMail: async (mail) => {
        try {
            const consulta = `select * from usuario where mail = ?`;
            const [result] = await db.execute(consulta, [mail]);
            if (result.length == 0) {
                throw new Error(`Usuario no encontrado con el mail : ${mail}`);
            }
            return result; //si no saltó el error en el if anterior entoces se devuelve el resultado
        } catch (error) {
            throw new Error(error.message);
        }
    },


    modificarRol: async (dato, id) => {
        try {
            const params = [dato.rol, id];
            const consulta = `update usuario set rol = ? WHERE id_usuario = ?`;
            const [result] = await db.execute(consulta , params );
            if (result.affectedRows === 0) {
                const error = new Error(`que no se ha encontrado el usuario con el id: ${id} `);
                error.statusCode = 404;
                throw error;
            }
            if (result.changedRows === 0) {
                const error = new Error(`que los datos ingresados en el usuario ${id} no han cambiado `);
                error.statusCode = 404;
                throw error;
            }
            return {message :'Exito al modificar el usuario. ', detalle: result }
        } catch (error) {
            throw new Error('Error al modificar el usuario: ' + error.message);
        }
    },
};

module.exports = Usuario;