class  Die {
    constructor(sides = 6){
        this.sides = sides;
    }
    roll() {
        let rollArr = [];
        for (let index = 0; index < 100; index++) {
            rollArr.push(Math.floor(Math.random() * this.sides) + 1);
        }
        var randomNumber = rollArr[Math.floor(Math.random() * 100)];
        return randomNumber;
    }
}

