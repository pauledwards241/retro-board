import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = process.env.PORT || 3001;

io.of('board').on('connection', (socket) => {
  socket.on('note added', (listId, noteId) => {
    socket.broadcast.emit('on note added', listId, noteId);
  });

  socket.on('note deleted', (listId, noteId) => {
    socket.broadcast.emit('on note deleted', listId, noteId);
  });

  socket.on('note locked', (noteId) => {
    socket.broadcast.emit('on note locked', noteId);
  });

  socket.on('note unlocked', (listId, noteId, content) => {
    socket.broadcast.emit('on note unlocked', listId, noteId, content);
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./client/build'));

  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: './client/build' });
  });
}

server.listen(port);
