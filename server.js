import express from 'express';
import path, { join } from 'path';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";;

const app = express();
const server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const io = new Server(server);

app.use(express.static(join(__dirname + '/public')));

io.on('connection', function(socket) {
    socket.on('newuser', function(username) {
        socket.broadcast.emit('update', username + ' вошел в чат');
    });
    socket.on('exituser', function(username) {
        socket.broadcast.emit('update', username + ' вышел из чата');
    });
    socket.on('chat', function(message) {
        socket.broadcast.emit('chat', message);
    });
})

server.listen(5000);