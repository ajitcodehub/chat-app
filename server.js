const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from public folder
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;
    io.to(room).emit('message', { user: 'System', text: `${username} joined "${room}"` });
  });

  socket.on('message', (data) => {
    io.to(data.room).emit('message', data);
  });

  socket.on('disconnect', () => {
    if (socket.username && socket.room) {
      io.to(socket.room).emit('message', {
        user: 'System',
        text: `${socket.username} left "${socket.room}"`
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
