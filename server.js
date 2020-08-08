const express = require('express');
const socket = require('socket.io');

const app = express();

let tasks = [];

//////////////////////////////////
tasks.push({idx: 'aaaaa', name: 'Takie długie name',});
tasks.push({idx: '351', name: 'Shopping something',});
tasks.push({idx: 'af43', name: 'Go out with the dog',});
///////////////////////////////////

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log(`Adding new connection with id = ${socket.id}`);
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    console.log('Adding new task', task);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (idx) => {
    console.log(`Removing task ${idx}`);
    tasks.splice(tasks.findIndex(i => i.idx === idx), 1);
    socket.broadcast.emit('removeTask', tasks);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
