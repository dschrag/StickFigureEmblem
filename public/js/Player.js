/*
Player Class documentation
Written by:
    Daniel Miller (dmiller4991@gmail.com)

Variables:
    Array<Units> unitArray;
    int unitNum; number of units alive (add one if it's really needed)
    int playerNum; Number to denote either player 1 or player 2. 
    int score;
    bool winner; will initially set to false to determine that no-one has achieved winning state. 
Functions:
    void addUnits;
    void removeUnits
    void sendScore;
    void calculateScore;
*/
function Player (number)
{
    this.turnsElapsed = 1; 
    this.playerName = "Please enter your name";
    this.setPlayerName = function (name) {
        if (name == undefined) {
            console.log(this.playerName)
        }
        else 
            this.playerName = name;
        
    }

    this.changeTurn = function (){
        this.turnsElapsed++;
    }

    this.numUnits = 3; 

    this.playerNum = number;
    this.score = 0;
    this.winner = false 

    this.killUnit = function () {
        console.log("Killing unit from " + this.playerNum)
        this.numUnits--;
    }

    this.addUnits = function (unit)
    {
        this.unitArray.push(unit);
    }

    this.removeUnits = function (unit)
    {
        for (i=0; i < this.unitArray.length; i++)
        {
            if (unit == this.unitArray[i])
            {
                this.unitArray.splice(i, 1);
            }
        }
    }

    this.calculateScore = function ()
    {
        console.log("Calculating score for " + this.playerNum);
        var unitsAlive = 0;
        var unitsKilled = 0; 
        var otherPlayer; 
        if (Player1.playerNum == this.playerNum) {
            console.log("Player1 is a loser")
            otherPlayer = Player2; 
        }
        else {
            console.log("Player1 is a loser")
            otherPlayer = Player1;
        }
        var i = 0;
        console.log("Checking units")
        for (i = 0; i < unitArray.length; i++) {
            console.log("searching for units");
            var unit = unitArray[i];
            if (unit == undefined) {
                console.log("done");
                break;
            }
            console.log("unit.pOnwer");
            console.log(unit.pOwner);
            console.log("unit.isdead");
            console.log(unit.isDead);
            
            if (unit.pOwner == this.playerNum) {
                if (!unit.isDead) {
                    unitsAlive++;
                }
            }
            console.log("otherPlayer");
            console.log(otherPlayer.playerNum);
            if (unit.pOwner == otherPlayer.playerNum) {
                if (unit.isDead) {
                    unitsKilled++;
                }
            }
            
        }
        console.log("less than 15 turns pass?")
        if (turnsElapsed < 15) {
            console.log("you did it m8")
            this.score += (2*(15-this.turnsElapsed))
        }
        console.log("current score: " + this.score);

        console.log("unitsKilled and unitsAlive");
        console.log(unitsKilled);
        console.log(unitsAlive);

        this.score += unitsKilled * 10;
        console.log("current score: " + this.score);
        this.score += (3 + 3 * Math.pow(unitsAlive, 2));
        console.log("current score: " + this.score);
        if (this.winner)
        {
            console.log("you da real mvp");
            this.score += 100;
        }
        console.log("current score: " + this.score);
    }

}