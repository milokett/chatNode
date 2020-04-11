const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio.listen.listen(server)

// config

app.set('port', process.env.PORT || 3000);

require('./sockets')(io);

 //enviando archivos estaticos 
 app.use(express.static(path.join(__dirname, 'public')));

// empezando el servidor
server.listen(app.get('port'), () => {
    console.log('server en puerto', app.get('port'));
})