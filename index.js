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
