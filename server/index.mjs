import express from 'express';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';

import NoteManager from './NoteManager';

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = process.env.PORT || 3001;
const noteManager = new NoteManager();

io.of('board').on('connection', (socket) => {
  socket.on('add', (data) => {
    socket.broadcast.emit('handleAdd', data);
  });

  socket.on('focus', (noteId) => {
    noteManager.lockNote(noteId);
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