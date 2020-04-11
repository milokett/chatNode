$(function () {

    const socket = io();

    //obteniendo elementos del dom desde la interfaz
   const $formularioMensaje = $('#formulario-mensaje');
   const $mensaje = $('#mensaje');
   const $chat = $('#chat');

   //obteniendo elementos del dom desde el formulario de usuarios
    const $formularioUsuario = $('#formularioUsuario');
    const $errorUsuario = $('#errorUsuario');
    const $usuario = $('#usuario');
    const $nombreUsuario = $('#nombreUsuario');

    $formularioUsuario.submit(e => {
        e.preventDefault();
        socket.emit('nuevo usuario', $usuario.val(), data => {
            if (data) {
                $('#contenedorUsuario').hide();
                $('#contenido').show();
            }else{
                $errorUsuario.html(`
                    <div class="alert alert-danger">
                        Ese usuario ya existe
                    </div>
                `);
            }
            $usuario.val('');
        });
    });

   //eventos
    $formularioMensaje.submit( e => {
        e.preventDefault();
        socket.emit('enviar mensaje', $mensaje.val(), data =>{
            $chat.append(` <p class="error"> ${data} </p>`)
        });
        $mensaje.val('');
    });


    socket.on('nuevo mensaje', function(data){
        $chat.append( '<b>' + data.user + '</b>: ' + data.mensaje + '<br/>')
    });

    socket.on('nombre usuario', data =>{
        let html = '';
        for (i = 0; i < data.length; i++){
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
        }
        $nombreUsuario.html(html);
    });

    socket.on('whisper', data =>{
        $chat.append(`<p class="whisper"><b> ${data.nick}</b> ${data.msj} </p>`);
    })


    socket.on('mensajes viejos', msjs =>{
        for (let i = 0; i < msjs.length; i++){
            mostrarMsj(msjs[i]);
        }
    })

    function mostrarMsj(data){
        $chat.append(`<p class="whisper"><b> ${data.nick}</b> ${data.msj} </p>`);
    }
})