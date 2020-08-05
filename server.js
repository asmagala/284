const express = require('express');
const socket = require('socket.io');

const app = express();

let tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = seocket(server);

io.on('connection', (socket) => {
  console.log(`Added new connection with id = ${socket.id}`);
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    console.log('Added new task', task);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (id) => {
    console.log(`Removed task ${id}`);
    tasks.splice(id, 1);
    socket.broadcast.emit('removeTask', id);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
