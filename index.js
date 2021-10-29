const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = "SK bot";
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // To current user
        socket.emit('message', formatMessage(botName, 'Welcome to Chatroom'));

        // To everyone except current user 
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} joined the chat!`));
    })

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    // When client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'User left the chat'));
    });

    // To everyone
    // io.emit();
});

const PORT = 8080 || process.env.PORT;
server.listen(PORT, () => console.log(`Server: ${PORT}`));