// server.js

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import formatmessage from './utils/messages.js';
import { userjoin, getcurrentuser, userleave, getroomuser } from './utils/users.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const botname = 'ChatBot';

io.on('connection', socket => {
    socket.on('joinroom', ({ username, room }) => {
        const user = userjoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatmessage(botname, 'Welcome to the chat!'));
        socket.broadcast.to(user.room).emit('message', formatmessage(botname, `${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getroomuser(user.room)
        });
    });

    socket.on('chatMessage', msg => {
        const user = getcurrentuser(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatmessage(user.username, msg));
        }
    });

    socket.on('disconnect', () => {
        const user = userleave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatmessage(botname, `${user.username} left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getroomuser(user.room)
            });
        }
    });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
