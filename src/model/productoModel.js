const db = require('../config/config_database');

metodos = {
    crear : async function (datos) {
        const params= [datos.nombre_prod, datos.precio, datos.categoria , datos.stock];
        const consulta = `insert into producto (nombre_prod, precio, categoria, stock )
                             values (?, ?, ?, ?)`;
        try {
            const [result] = await db.execute(consulta, params);
            return { message: 'Exito al crear producto. ', detail: result};
        } catch (error) {
                if (error.code === 'ER_BAD_NULL_ERROR') {
                    throw new Error('Error al crear producto, hay campos que no pueden ser :null ' + error.message);
                }
                if (error.code === 'WARN_DATA_TRUNCATED') {
                    throw new Error(`Error al crear producto, las categorías deben ser alguna de las siguientes:
                    ('gaseosas','aguas','vinos','cervezas','espumantes','tragos','postres','platos')). ` + error.message);
                }
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error(`Error al crear producto, el producto: ${datos.nombre_prod} ya se encuentra cargado. ` + error.message);
                }
                if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                    throw new Error(`No se pudo crear producto, se requieren datos que no han sido cargados. ` + error.message);
                } else {
                    throw new Error('Error al crear producto. ' + error.code);   
                }   
        }
    },
    
    listarTodos: async function (){            // ****VER CONDICION SI QUIERO LISTAR Y NO EXISTEN MESAS CARGADAS*****
        const consulta = `select * from producto`;
        try {
            const [result] = await db.execute(consulta);
            if (result.length == 0) {
                const error = new Error(`No existen productos cargados.`);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al listar productos. ', detail: result }
        } catch (error) {
            throw new Error('Error al listar productos. ' + error.message);
        }
    },

    modificarProd: async function (id, datos) {
        try {
            const params = [datos.nombre_prod, datos.precio, datos.categoria , datos.stock, id];
            const consulta = `update producto set nombre_prod = ?, precio = ?, categoria = ?, stock = ?
                                WHERE id_prod = ?`;
            const [result] = await db.execute(consulta, params);
            if (result.affectedRows === 0) {
                const error = new Error(`que no se ha encontrado producto con el id: ${id} .`);
                error.statusCode = 404;
                throw error;
            }
            if (result.changedRows === 0) {
                const error = new Error(`debido a que los datos ingresados no han cambiado. `);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al modificar producto. ', detalle: result };
        } catch (error) {
            if (error.code === 'ER_BAD_NULL_ERROR') {
                throw new Error('Error al modificar producto, hay campos que no pueden ser :null ' + error.message);
            }
            if (error.code === 'WARN_DATA_TRUNCATED') {
                throw new Error(`Error al modificar producto, las categorías deben ser alguna de las siguientes:
                ('gaseosas','aguas','vinos','cervezas','espumantes','tragos','postres','platos')). ` + error.message);
            }
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error(`Error al modificar producto, el producto: ${datos.nombre_prod} ya se encuentra cargado. ` + error.message);
            }
            if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                throw new Error(`No se pudo modificar producto, se requieren datos que no han sido cargados. ` + error.message);
            } else {
                throw new Error('Error al modificar producto. ' + error.message);   
            }   
            }
    },

    eliminarProd: async function (id) {
        try {
            const consulta = `delete from producto WHERE id_prod = ?`;
            const [result] = await db.execute(consulta, [id]);
            if (result.affectedRows === 0) {
                const error = new Error(`No se encontro un producto con el id: ${id}`);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al eliminar el producto .', detalle: result };
        } catch (error) {
            throw new Error('Error al eliminar el producto .' + error.message);
        }
    },

    listarPorcategoria: async function (categoria){            // ****VER CONDICION SI QUIERO LISTAR Y NO EXISTEN MESAS CARGADAS*****
        try {
            const consulta = `select * from producto where categoria = ?`;
            const [result] = await db.execute(consulta, [categoria]);
            if (result.length === 0) {
                const error = new Error(`no existe la categoria: ${categoria}, o no tiene productos cargados.`);
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Exito al listar productos por categoria: ', detail: result }
        } catch (error) {
            throw new Error('Error al listar productos por categoria: ' + error.message);
        }
    },
}
module.exports = metodos;