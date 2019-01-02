const express = require('express');

const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3001;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello world' });
});

io.of('board').on('connection', (socket) => {
  socket.on('add', (data) => {
    socket.broadcast.emit('handleAdd', data);
  });

  socket.on('focus', (noteId) => {
    socket.broadcast.emit('handleFocus', noteId);
  });

  socket.on('blur', (data) => {
    socket.broadcast.emit('handleBlur', data);
  });
});


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

server.listen(port);
