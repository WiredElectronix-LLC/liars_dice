function joinGame(){
    game.style.display = 'initial';
    hide.style.display = 'initial';
    game.innerHTML = '';
    playerName = document.getElementById('name').value
    // send to api
    players.push(new Player(playerName));
    // console.log(players);
    game.innerHTML += `<h3>${playerName} added to player list</h3>`;
    // setTimeout(addPlayer , 1000);
}


function startGame(){
    game.style.display = 'none';
    hide.style.display = 'initial';
    game.innerHTML = '';
    document.getElementById('name').style.display = 'none';
    document.getElementById('join').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    document.getElementById('end').style.display = 'initial';
    document.getElementById('lift').style.display = 'initial';
    document.getElementById('guess').style.display = 'initial';
    document.getElementsByTagName('select')[0].style.display = 'initial';
    document.getElementsByTagName('select')[1].style.display = 'initial';
    document.getElementsByClassName('dice')[0].style.display = 'initial';
    let lables = document.getElementsByTagName('label');

    for (let index = 0; index < lables.length; index++) {
        const e = lables[index];
        e.style.display = 'initial';
    }
    playersLeft = players;
    gameRound(true);
}

function endGame(){
    game.style.display = 'none';
    hide.style.display = 'initial';
    document.getElementById('name').style.display = 'initial';
    document.getElementById('join').style.display = 'initial';
    document.getElementById('start').style.display = 'initial';
    document.getElementById('end').style.display = 'none';
    document.getElementById('lift').style.display = 'none';
    document.getElementById('guess').style.display = 'none';
    document.getElementsByTagName('select')[0].style.display = 'none';
    document.getElementsByTagName('select')[1].style.display = 'none';
    document.getElementsByClassName('dice')[0].style.display = 'none';
    let selects = document.getElementsByClassName('styled-select');

    for (let index = 0; index < selects.length; index++) {
        const e = selects[index];
        e.style.display = 'none';
    }
    let lables = document.getElementsByTagName('label');

    for (let index = 0; index < lables.length; index++) {
        const e = lables[index];
        e.style.display = 'none';
    }
    players = [];
    guesses = [];
}

function neutral(player){
    document.getElementById('name').style.display = 'none';
    document.getElementById('join').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    document.getElementById('end').style.display = 'none';
    document.getElementById('lift').style.display = 'none';
    document.getElementById('guess').style.display = 'none';
    document.getElementById('prevGuess').style.display = 'none';
    document.getElementById('wilds').style.display = 'none';
    document.getElementById('totalDice').style.display = 'none';
    document.getElementsByTagName('select')[0].style.display = 'none';
    document.getElementsByTagName('select')[1].style.display = 'none';
    document.getElementsByClassName('dice')[0].style.display = 'none';

    let lables = document.getElementsByTagName('label');

    for (let index = 0; index < lables.length; index++) {
        const e = lables[index];
        e.style.display = 'none';
    }
    let selects = document.getElementsByClassName('styled-select');

    for (let index = 0; index < selects.length; index++) {
        const e = selects[index];
        e.style.display = 'none';
    }

    // players.forEach(player => {
        
        var x = document.createElement("button");
        x.setAttribute('onclick', `turn(players[${players.indexOf(player)}])`);
        x.classList.add('players');
        var t = document.createTextNode(player.name);
        x.appendChild(t);
        playerList.appendChild(x); 
    // });
    
}

function gameRound(nR = false){
    if (playersLeft.length == 1){
        game.innerHTML = `Player ${players[0].name} Won!<br><button onclick='endGame()'>Start New Game</button>`;
        game.style.display = 'initial';
        hide.style.display = 'none';
        playerList.innerHTML = '';
    }else{
        game.style.display = 'none';
        hide.style.display = 'initial';
        let numDice = count();
        const q = document.getElementById("quantity");
        if (nR) {
            console.log('New Round');
            q.innerHTML = '';
            playerList.innerHTML = '';
            guesses = [];
            for (let i = 1; i < numDice + 1; i++) {
                var x = document.createElement("OPTION");
                x.setAttribute("value", i);
                var t = document.createTextNode(i);
                x.appendChild(t);
                q.appendChild(x);
            }
        }else{
            console.log('Round');
            q.innerHTML = '';
            for (let i = 1; i < numDice + 1; i++) {
                // console.log(guesses[guesses.length-1][0]);
                if (i < guesses[guesses.length-1][0] || (guesses[guesses.length-1][1] == 6 && i == guesses[guesses.length-1][0])) {
                    continue;
                }else{
                    var x = document.createElement("OPTION");
                    x.setAttribute("value", i);
                    var t = document.createTextNode(i);
                    x.appendChild(t);
                    q.appendChild(x);    
                }
                
            }    
        }
        


        players.forEach(player => {
            if (nR){
                
                if (player.out()) {
                    // skip
                    playersLeft.splice(playersLeft.indexOf(player),1);
                    // console.log('skipped');
                    if (playersLeft.length == 1){
                        game.innerHTML = `Player ${players[0].name} Won!<br><button onclick='endGame()'>Start New Game</button>`;
                        game.style.display = 'initial';
                        hide.style.display = 'none';
                        playerList.innerHTML = '';
                    }
                    console.log(playersLeft);
                } else {
                    player.roll() 
                }
            }
            // console.log(player);
            // turn(player);
            // if (player.out()) {
                // playersLeft.splice(playersLeft.indexOf(player),1);
                // console.log(playersLeft);
                // skip
                // console.log('skipped');
            if(playersLeft.length > 1) {
                // if (playersLeft.length == 1){
                //     game.innerHTML = `Player ${player.name} Won!`;
                // }else{
                    neutral(player);    
                // }
                
                // turn(player);
            }
        });
    }
}



function turn(p){

   
    

    document.getElementById('name').style.display = 'none';
    document.getElementById('join').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    document.getElementById('end').style.display = 'initial';
    document.getElementById('lift').style.display = 'initial';
    document.getElementById('guess').style.display = 'initial';
    document.getElementsByTagName('select')[0].style.display = 'initial';
    document.getElementsByTagName('select')[1].style.display = 'initial';
    document.getElementsByClassName('dice')[0].style.display = 'initial';
    document.getElementById('prevGuess').style.display = 'initial';
    document.getElementById('wilds').style.display = 'initial';
    document.getElementById('totalDice').style.display = 'initial';
    let selects = document.getElementsByClassName('styled-select');

    for (let index = 0; index < selects.length; index++) {
        const e = selects[index];
        e.style.display = 'inline-block';
    }

    let lables = document.getElementsByTagName('label');

    for (let index = 0; index < lables.length; index++) {
        const e = lables[index];
        e.style.display = 'initial';
    }

    pbutton = document.getElementsByClassName('players');

    for (let index = 0; index < pbutton.length; index++) {
        const e = pbutton[index];
        e.style.display = 'none';
    }
    

    

    wild();
    // set user as active
    document.getElementById('name').value = p.name;
    // reveal dice
    let dice = document.getElementsByClassName('dice')[0];
    dice.innerHTML = '';
    for (let i = 0; i < p.rolled.length; i++) {
        let roll = p.rolled[i];
        var x = document.createElement("LI");
            var t = document.createTextNode(roll);
            x.appendChild(t);
            dice.appendChild(x);
    }
    // let user see last guess and total dice in play
    document.getElementById('totalDice').innerHTML = `Total Dice Left: ${count()}`;
    if(guesses.length != 0){
        var lastGuess = guesses[guesses.length-1];
        var html = `Quantity: ${lastGuess[0]} Number: ${lastGuess[1]}`; 
        document.getElementById('prevGuess').innerHTML = html;   
    }

    // let user guess or lift
    document.getElementById("guess").setAttribute('onclick',`players[${players.indexOf(p)}].guess()`);

    document.getElementById("lift").setAttribute('onclick',`players[${players.indexOf(p)}].lift()`);

    // return to loop
}

function guess(){
    var quantity = document.getElementById('quantity').value;
    var num = document.getElementById('num').value;
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

function count(){
    let totalDice = 0;
    players.forEach(player => {
        totalDice += player.dice.length;
    }); 
    return totalDice   
}

function wild(){
    var html = '';
    // var style;
    if (guesses[0] != '1,1' || guesses.length == 0){
        html = "WILD";
        document.getElementById('wilds').classList.remove('natural');
        document.getElementById('wilds').classList.add('wild');
        
    }else if (guesses[0] == '1,1'){
        html = "NATURAL";
        document.getElementById('wilds').classList.add('natural');
        document.getElementById('wilds').classList.remove('wild');
    }
    document.getElementById('wilds').innerHTML = html;
    
    return (guesses[0] != '1,1');
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