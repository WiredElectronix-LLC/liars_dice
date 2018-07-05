class Player {
    constructor(name){
        this.name = name;
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
    // guess(){
    //     guess.push([(Math.floor(Math.random() * 6)+1),(Math.floor(Math.random() * 6)+1)]);
    // }

    guess(){
        if(guess()){
            gameRound();
        }
    }

    lift(){
        // console.log(guesses);
        if(num(guesses[guesses.length-1][1])){
            this.lostRound();
            gameRound(true);
        }else if (!num(guesses[guesses.length-1][1])) {
            // console.log(players.indexOf(players.name == this.name));
            let pos = players.map(e => e.name ).indexOf(this.name);
            // console.log(pos)
            if (pos == 0) {
                players[players.length-1].lostRound();
            } else {
                players[pos-1].lostRound();
            }
            gameRound(true);
        };
    }
    out(){
        return (this.dice.length == 0)        
    }
    lostRound(){
        this.dice.splice(0,1);
        // console.log(`Player ${this.name} lost`)
    }
    reset(){
        this.dice = new Array(5);
        for (let index = 0; index < this.dice.length; index++) {
            this.dice[index] = new Die;
        }
    }
}