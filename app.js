const express = require('express');
const config = require('./src/config/config.json');
const app = express();

var cors = require('cors');
app.use(cors());

var morgan = require('morgan')
app.use(morgan('common'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//conocer los distintos controladores, saber donde estan, traelos como constantes locales
const usuarioController = require('./src/controller/usuarioController');
const reservaController = require('./src/controller/reservaController');
const mesaController = require('./src/controller/mesaController');
const cuentaController = require('./src/controller/cuentaController');
const mesaPorCuentaController = require('./src/controller/mesaPorCuentaController');
const productoController = require('./src/controller/productoController');
const productoPorCuentaController = require('./src/controller/productoPorCuentaController');



//redireccionar las distintas peticiones a su correspondiente controlador.
app.use('/usuario', usuarioController);
app.use('/reserva', reservaController);
app.use("/mesa", mesaController);
app.use("/cuenta", cuentaController);
app.use("/mesaPorCuenta", mesaPorCuentaController);
app.use("/producto", productoController);
app.use("/productoPorCuenta", productoPorCuentaController);



// funcion que intenta iniciar el servidor en el puerto especificado o en el siguiente disponible
function startServer(puerto) {
    const server = app.listen(puerto, () => {
        console.log(`Servidor escuchando en: http://localhost:${puerto}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Puerto ${puerto} en uso, intentando con el puerto ${puerto + 1}...`);
            puerto++;
            startServer(puerto); // Intenta con el siguiente puerto
        } else {
            console.error("Error al iniciar el servidor:", err);
        }
    });
}

// invocamos la funcion que intenta iniciar el servidor en el puerto que le pasemos
startServer(config.server.port);

module.exports = app;