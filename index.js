require('dotenv').load();

let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let path = require('path');

require('./functions');
require('./player');
require('./die');

// Sockets Variables
let connections = [];

// Game Variables
let players = [],guesses = [],game,playerName,newRound, pbutton = [], playersLeft = [],playerList,hide;


app.use('/client/css', express.static(path.join(__dirname, 'css')));

app.use('/client/js', express.static(path.join(__dirname, 'js')));

const port = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', socket => {
    connections.push(socket);
    console.log(`Connected: ${connections.length} sockets connected`);

    socket.on('disconnect', data => {
        connections.splice(connections.indexOf(data));
        console.log(`Disconnected: ${connections.length} sockets connected`)
    })
})

server.listen(port);
console.log(`App is running on port ${port}...`);