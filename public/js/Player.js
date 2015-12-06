/*
Player Class documentation
Written by:
    Daniel Miller (dmiller4991@gmail.com)

Variables:
    int playerNum
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
    this.playerNum = number;
    this.score = 0;
    this.unitArray = new Array;
    this.winner = false 

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

    this.move = function(unit)
    {

    }
    this.attack = function(unit)
    {

    }

    this.caclulateScore = function ()
    {

    }
    this.sendScore = function()
    {

    }
}