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
    this.playerName = "Please enter your name";
    this.setPlayerName = function (name) {
        if (name == undefined) {
            console.log(this.playerName)
        }
        else 
            this.playerName = name;
        
    }

    this.numUnits = 3; 

    this.playerNum = number;
    this.score = 0;
    this.winner = false 

    this.killUnit = function (){
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

    this.caclulateScore = function ()
    {
        var unitsAlive = 0;
        var unitsKilled = 0; 
        var otherPlayer; 
        if (Player1.playerNum == this.playerNum){
            otherPlayer = Player2; 
        }
        else {
            otherPlayer = Player1;
        }

        for (i = 0; i < unitArray.length; i++) {
            var unit = unitArray[i];
            if (unit.pOwner == this.playerNum) {
                if (!unit.isDead) {
                    unitsAlive++;
                }
            }
            
            if (unit.pOwner == otherPlayer.playerNum) {
                if (unit.isDead) {
                    unitsKilled++;
                }
            }
            
        }

        if (turnsElapsed < 15) {
            this.score += (2*(15-turnsElapsed))
        }

        this.score += unitsKilled * 10;

        this.score += (3 + 3 * Math.pow(unitsAlive, 2));

        if (this.winner)
        {
            this.score += 100;
        }
    }
    this.sendScore = function()
    {

    }
}