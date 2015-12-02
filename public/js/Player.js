/*
Player Class documentation
Written by:
    Daniel Miller (dmiller4991@gmail.com)

Variables:
    Array<Units> unitArray;
    int unitNum; number of units alive. 
    int playerNum; Number to denote either player one or player 2. 
    int score;
Functions:
    void addUnits;
    void removeUnits
    void sendScore;
*/
function Player (number)
{
    this.playerNum = number;
    this.score = 0;
    this.unitArray = new Array;
    this.unitNum = 0;

    this.addUnits = function (unit)
    {
        this.unitArray.push(unit);
        this.unitNum++;
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
    this.sendScore = function()
    {

    }
}