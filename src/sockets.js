const Chat = require('./models/Chat');

module.exports = function (io) {

    let usuarios = {

    };

    io.on('connection', async socket => {
        console.log('un nuevo usuario conectado');

        let mensajes = await Chat.find({}).limit(10);
        socket.emit('mensajes viejos', mensajes);

        socket.on('nuevo usuario', (data, cb) => {
            if (data in usuarios){
                cb(false);
            } else{
                cb(true);
                socket.usuario = data;
                usuarios[socket.usuario] = socket;
                actualizarUsuarios();
            }
        });

        socket.on('enviar mensaje', async (data, cb) => {

            var msj = data.trim();

            if (msj.substr(0, 3) === '/p ') {
                msj = msj.substr(3);
                var index = msj.indexOf(' ');
                if (index !== -1) {
                    var nombre = msj.substring(0, index);
                    var msj = msj.substring(index + 1);
                    if (nombre in usuarios){
                        usuarios[nombre].emit('whisper', {
                           msj,
                           nick: socket.usuario
                        });
                    } else {
                        cb('Error! Ingresa un usuario que este activo.');
                    }
                } else {
                    cb('Error! Ingresa un mensaje valido.');
                }
            } else {
                var nuevoMensaje = new Chat({
                    msj,
                    nick: socket.usuario
                });
                await nuevoMensaje.save();

                io.sockets.emit('nuevo mensaje', {
                    mensaje: data,
                    user: socket.usuario
                });
            }
        });

        socket.on('disconnect', data => {
            if(!socket.usuario) return;
            delete usuarios[socket.usuario];
            actualizarUsuarios();
        });

        function actualizarUsuarios(){
            io.sockets.emit('nombre usuario', Object.keys(usuarios));
        }

    });

}


