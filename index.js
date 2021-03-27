const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');

app.use(express.static('public'));

// Routes
app.get('/', (req, res)=>  {
  res.render('index.ejs');
});

// Initialize http server
const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () =>{
  console.log(`Listening on port -> ${server.address().port}`);
});

// Connection event is fired as soon as a client connects to this socket.

const io = socketIO(server);
io.sockets.on('connection', onSocketConnection);

function onSocketConnection (socket) {

  socket.on('message', (message, room) => {
	  console.log('Client said: ', message);
	  socket.in(room).emit('message', message, room);
  });

  socket.on('create or join', (room) => {

    const clientsInRoom = io.sockets.adapter.rooms[room];
    const numClients = clientsInRoom ? Object.keys(clientsInRoom).length : 0;

    console.log('Room ' + room + ' now has ' + numClients + ' client(s)');

    switch (numClients) {
      case 0:
        socket.join(room);
        console.log('Client ID ' + socket.id + ' created room ' + room);
        socket.emit('created', room, socket.id);
        break;
      case 1:
        console.log('Client ID ' + socket.id + ' joined room ' + room);
        io.sockets.in(room).emit('join', room);
        socket.join(room);
        socket.emit('joined', room, socket.id);
        break;
      default:
        socket.emit('full', room);
	  }

  });

  socket.on('left', ()=>  {
	  console.console.log('received bye');
  });

}
