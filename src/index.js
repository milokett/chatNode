const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');

const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketio.listen.listen(server)

// conexion a db

mongoose.connect('mongodb://localhost/node-chat')
    .then(db => console.log('db ta conectada'))
    .catch(err => console.log(err));


// config

app.set('port', process.env.PORT || 3000);

require('./sockets')(io);

 //enviando archivos estaticos 
 app.use(express.static(path.join(__dirname, 'public')));

// empezando el servidor
server.listen(app.get('port'), () => {
    console.log('server en puerto', app.get('port'));
})