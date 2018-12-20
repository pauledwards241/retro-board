const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 8080;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello world' });
});

io.of('board').on('connection', (socket) => {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data);
  });
});

server.listen(port);
