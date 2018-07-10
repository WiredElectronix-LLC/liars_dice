var socket = io.connect();

function getValueOfElement(id){
    return document.getElementById(id).value;
}

function resetValueOfElement(id){
    return document.getElementById(id).value = '';
}

function setValueOfElement(id,value){
    return document.getElementById(id).innerHTML = value;
}

function appendToElement(id,value){
    return document.getElementById(id).innerHTML += `<br>${value}`
}

function hideElementById(id){
    return document.getElementById(id).style.display = 'none';
}

function showElementById(id){
    return document.getElementById(id).style.display = 'initial';
}

function hideElementsByTag(tag){
    var list = document.getElementsByTagName(tag);
    for (let index = 0; index < list.length; index++) {
        const e = list[index];
        e.style.display = 'none';
    }
}

function showElementsByTag(tag){
    var list = document.getElementsByTagName(tag);
    for (let index = 0; index < list.length; index++) {
        const e = list[index];
        e.style.display = 'initial';
    }
}

function hideElementsByClass(className){
    var list = document.getElementsByClassName(className);
    for (let index = 0; index < list.length; index++) {
        const e = list[index];
        e.style.display = 'none';
    }
}

function showElementsByClass(className){
    var list = document.getElementsByClassName(className);
    for (let index = 0; index < list.length; index++) {
        const e = list[index];
        e.style.display = 'initial';
    }
}

function joinGame(){
    socket.emit('join', getValueOfElement('name'));
}

function startGame(emit = true){
        // hide elements
        hideElementById('game');
        hideElementById('name');
        hideElementById('join');
        hideElementById('start');
        // reset innerHTML
        resetValueOfElement('game');
        // show elements
        showElementById('end');
        showElementById('lift');
        showElementById('guess');
        showElementById('hide');
        showElementById('dice');
        showElementsByTag('select');
        showElementsByTag('label');
        if (emit) {
            socket.emit('start', true);    
        }
}

function endGame(emit = true){
    if (emit) {
        socket.emit('end');    
    }
        
    showElementById('hide');
    showElementById('name');
    showElementById('join');
    showElementById('start');

    hideElementById('game');
    hideElementById('end');
    hideElementById('lift');
    hideElementById('guess');
    hideElementById('dice');
    hideElementsByTag('select');
    hideElementsByClass('styled-select');
    hideElementsByTag('label');
}

function guess(){
    // send guess
    const quantity = getValueOfElement('quantity');
    const number = getValueOfElement('num');
    socket.emit('guess', {number: number, quantity: quantity})
    socket.emit('nextPlayer');
    console.log('guessed')
}

function lift(){
    socket.emit('lift');
}

function quantitySelect(numDice,guess = [0,0]){
    const q = document.getElementById("quantity");
    q.innerHTML = '';
    // for (let i = 1; i < numDice + 1; i++) {
    //     var x = document.createElement("OPTION");
    //     x.setAttribute("value", i);
    //     var t = document.createTextNode(i);
    //     x.appendChild(t);
    //     q.appendChild(x);
    // }

    for (let i = 1; i < numDice + 1; i++) {
        console.log(guess[0]);
        if (i < guess[0] || (guess[1] == 6 && i == guess[0])) {
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



socket.on('dice', data =>{
    console.log(data);
    let diceDisplay = document.getElementById('dice');
    diceDisplay.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        let roll = data[i];
        var x = document.createElement("LI");
            var t = document.createTextNode(roll);
            x.appendChild(t);
            diceDisplay.appendChild(x);
    }
    showElementById('dice');
    showElementsByClass('styled-select');
})

socket.on('start game',() => {
    startGame(false);
})

socket.on('end game',() => {
    endGame(false);
})

socket.on('turn', data =>{
    quantitySelect(data.totalDice,data.lastGuess);
    showElementById('turnControls');
    if (data.lastGuess) {
        setValueOfElement('prevGuess', `Quantity: ${data.lastGuess[0]}  Number: ${data.lastGuess[1]}`)
        showElementById('prevGuess');  
    }
    

    if (data.wilds){
        html = "WILD";
        document.getElementById('wilds').classList.remove('natural');
        document.getElementById('wilds').classList.add('wild');
        resetValueOfElement('wilds');
        setValueOfElement('wilds',html);
        
    }else if (!data.wilds){
        html = "NATURAL";
        document.getElementById('wilds').classList.add('natural');
        document.getElementById('wilds').classList.remove('wild');
        resetValueOfElement('wilds');
        setValueOfElement('wilds',html);
    }

    showElementById('wilds');
    resetValueOfElement('totalDice');
    setValueOfElement('totalDice', data.totalDice);
    showElementById('totalDice');

    console.log(data);
})

socket.on('new player', data => {
    appendToElement('game', `${data} has joined`);
} )

socket.on('wait',() => { 
    hideElementById('turnControls');
})

socket.on('end of round', (data)=>{
    resetValueOfElement('game');
    setValueOfElement('game', data);
    showElementById('game');
    // setTimeout(hideElementById('game'),7000);
})

socket.on('out',data =>{
    resetValueOfElement('game');
    setValueOfElement('game', data);
    showElementById('game');
    // setTimeout(hideElementById('game'),7000);
})

socket.on('game over', data =>{
    resetValueOfElement('game');
    setValueOfElement('game', data);
    showElementById('game');
    // setTimeout(hideElementById('game'),7000);    
})