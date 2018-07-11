require('dotenv').load();

let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let path = require('path');
let Die = require('./die');

// Sockets Variables
let connections = [];
let users = [];

// Game Variables
let players = [],guesses = [],game,playerName,newRound, pbutton = [], playersLeft = [],playerList,hide,currPlayer=0;

// Paths
app.use('/client/css', express.static(path.join(__dirname, 'css')));

app.use('/client/js', express.static(path.join(__dirname, 'js')));

const port = process.env.PORT || 3000;

// Routes
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

// Classes
class Player {
    constructor(name,socketId){
        this.name = name;
        this.id = socketId;
        this.dice = new Array(5);
        for (let index = 0; index < this.dice.length; index++) {
            this.dice[index] = new Die;
        }    
        this.rolled;
    }
    ai(){
        if (newRound) {
            this.roll();    
        }
        this.guess();
    }
    roll(){
        this.rolled = [];
        for (let index = 0; index < this.dice.length; index++) {
            this.rolled.push(this.dice[index].roll());
        }
        // console.log(this.rolled);
        return this.rolled;
    }

    lift(){
        // console.log(guesses);
        let pos = players.map(e => e.name ).indexOf(this.name);
        if(num(guesses[guesses.length-1][1])){
            this.lostRound();
            if (pos == 0) {
                wonRound(this.name,players[pos+1].name);
            } else {
                wonRound(this.name,players[pos-1].name);
            }
            gameRoundSetup();
        }else if (!num(guesses[guesses.length-1][1])) {
            if (pos == 0) {
                
                players[players.length-1].lostRound();
                wonRound(players[players.length-1].name,this.name);
            } else {
                
                players[pos-1].lostRound();
                wonRound(players[pos-1].name,this.name);
            }
            gameRoundSetup();
        };
    }
    out(){
        return (this.dice.length == 0)  
        io.emit('out', `Player ${this.name} is out`)      
    }
    lostRound(){
        this.dice.splice(0,1);
    }
    reset(){
        this.dice = new Array(5);
        for (let index = 0; index < this.dice.length; index++) {
            this.dice[index] = new Die;
        }
    }
}

// Sockets.io
io.sockets.on('connection', socket => {
    connections.push(socket);
    console.log(`Connected: ${connections.length} sockets connected`);

    socket.on('disconnect', data => {
        // console.log(players[socket.playerIndex]);
        // console.log(players);
        // players.splice(socket.playerIndex,1);
        // // console.log(`${socket.playerIndex} has left`);
        // players.forEach((player, index) => {
        //     if (index >= socket.playerIndex){
        //         let pos = connections.map(e => e.playerIndex).indexOf(index+1);
        //         // console.log(connections[pos].playerIndex);
        //         connections[pos].playerIndex = index;
        //         // console.log(connections[pos].username);
        //         // console.log(connections[pos].playerIndex);
        //     }
        // });
        connections.splice(connections.indexOf(data));
        // console.log(players);
        console.log(`Disconnected: ${connections.length} sockets connected`)
    })
    socket.on('join', data => {
        players.push(new Player(data,socket.id));
        socket.username = data;
        socket.playerIndex = players.length - 1;
        io.emit('new player', data);
    })
    socket.on('start', (data, callback) => {
        startGame();
    })
    socket.on('end', () =>{
        endGame();
    })
    socket.on('nextPlayer', () => { 
        function currPlayerInc(){
            if (currPlayer == players.length - 1) {
                currPlayer = 0;
            }else{
                currPlayer++;
            }    
            checkIfOut();
        }
        function checkIfOut(){
            if (!players[currPlayer].out()) {
                turn();
            } else {
                currPlayerInc();
            }
        }
        currPlayerInc();
    }) 
    socket.on('guess',(data)=>{
        // console.log(data);
        guess(data.quantity,data.number)
    })
    socket.on('lift',()=>{
        players[socket.playerIndex].lift();
        currPlayer = socket.playerIndex;
    })
})

server.listen(port);
console.log(`App is running on port ${port}...`);

// Functions
function wonRound(lost, won){
    io.emit('end of round', `${won} won the round and ${lost} lost a die`);
    playersLeft = [];
    players.forEach(player => {
        // console.log(player);
        if(!player.out()){
            playersLeft.push(player);
        }
    });
    // console.log(playersLeft);
    if (playersLeft.length == 1) {
        io.emit('game over', `Player ${playersLeft[0].name} has won the game.`);
        setTimeout(endGame, 5000);
    }
}

function count(){
    let totalDice = 0;
    players.forEach(player => {
        totalDice += player.dice.length;
    }); 
    return totalDice   
}

function num(x){
    let rollArry = [];
    let output = [];
    players.forEach(player => {
        player.rolled.forEach(roll =>{
            rollArry.push(roll);
        })
    })
    if (wild()) {
        output = rollArry.filter((num)=>{
            return (num == x || num == 1);
        });
    } else {
        output = rollArry.filter((num)=>{
            return (num == x);
        });
    }
    let ammount = guesses[guesses.length-1][0];
    // console.log(ammount);
    // console.log(ammount <= output.length);
    return (ammount <= output.length);
    // output.length;
    // console.log(output);
    // console.log(rollArry);
}

function guess(quantity,num){
    if (guesses.length == 0) {
        guesses.push([quantity, num]);
        // gameRound();
        return true;
    }
    if (guesses[guesses.length-1][0] > quantity) {
        return false;
    } else if (guesses[guesses.length-1][0] == quantity && guesses[guesses.length-1][1]>= num) {
        return false;
    }else{
        guesses.push([quantity, num]);
        // gameRound();
        return true;
    }
}

function wild(){
    return (guesses[0] != '1,1');
}

function turn(){
    // return new Promise((resolve,reject)=>{
        let data = {
            lastGuess: guesses[guesses.length-1],
            totalDice: count(),
            wilds: wild()
        };
        // let turnInAction = true;
        // console.log(players[i]);
        io.emit('wait');
        io.to(players[currPlayer].id).emit('turn', data);
    
    
        // console.log(currPlayer);
    
         
    
        // io.on('lift',()=>{
        //     return lift = true;
        // })
    // })
    // let lift = false;

    
}

function startGame(){
    io.emit('start game');
    gameRoundSetup();
    
}

function endGame(){
    players = [];
    guesses = [];
    io.emit('end game');
}



function gameRoundSetup(){        
    guesses = [];
    players.forEach(player => {  
        if (!player.out()) {
            player.roll()
        } 
    });
    displayDice();
    turn();
}

function displayDice(){
    // console.log(connections);
    connections.forEach(socket => {
        let dice = players[socket.playerIndex].rolled;
        io.to(socket.id).emit('dice', dice); 
    });
}