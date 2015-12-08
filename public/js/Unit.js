
/*
   Unit Class documentation
   Written by:
        Daniel Miller (dmiller4991@gmail.com)
   Variables:
        var health; 
	    var baseDamage;
	    var critDamage; 
	    var unitClass;
        var unitModel;
        var isDead; flag for checking if the unit is dead
        var pOwner; Player who owns it. Denoted by 0 (no one), 1 (player 1), or 2 (player2) 
        var validMoves[]; positions that can be moved to. 
        var validAttacks[]; positions that can attacked. 

   Functions:
        void setModel(Model model); 
        void combat(UNIT unit1, UNIT unit2, bool counter); 
        bool crictical(attacker, defender); 
        void destroyUnit();
*/
function Unit(unitClass) {
    
    this.unitClass = unitClass;
    this.pOwner = 0; // initalize it to 0 at first. It'll be changed when the game starts. 
    this.isDead = false;
    this.unitModel = undefined;
    this.validMoves = undefined;
    this.validAttacks = undefined;
    this.position = { x: 0, z: 0 };

    if (unitClass == "warrior" || unitClass == "Warrior") {
        // Warrior specific attributes. 

        this.health = 250; // strongest health

    }
    else if (unitClass == "mage" || unitClass == "Mage") {
        // Mage specific attributes. 

        // I took the average of 250 + 125 to try and rounded to the nearest 10's place
        // so this class could reflect a balance of the two other classes. 
        this.health = 190;

    }
    else if (unitClass == "ranger" || unitClass == "Ranger") {
        // Ranger specific attributes

        this.health = 125 // weakest health. 

    }
    else {
        // not sure what to do here. 
        console.error("unitClass was not a defined class.");
    }
    this.baseDamage = 45 // may change to differ with classes classes. 
    this.criticalDamage = this.baseDamage * 1.5; // start off with 1.5 damage modifier for crit damage

    this.setModel = function (model) {
        this.unitModel = model;
    }

    this.setPosition(x, z)
    {
        this.position.x = x;
        this.position.z = z;
    }

    this.setMoves = function (unitArray)
    {
        
        if (this.unitClass == "ranger" || this.unitClass == "Ranger")
        {
            this.validMoves = [{x:-2, z:0},{x:-1, z:0},{x:-1, z:-1},{x:-1, z:1}, 
                {x:0, z:0},{x:0, z:-2},{x:0, z:-1},{x:0, z:1},{x:0, z:2},{x:1, z:0},{x:1, z:-1},{x:1, z:1},{x:2, z:0}]; 
        }
        if (this.unitClass == "warrior" || this.unitClass == "Warrior")
        {
            this.validMoves = new Array;
            var x = -3;    
            while (x < 4){
                var z = -3; 
                while(z < 4){
                    var tempPos = {x:0, z:0};
                    tempPos.x = x;
                    tempPos.z = z;
                    this.validMoves.push(tempPos)
                    z++
                }

                x++;
            }

        }
        if (this.unitClass == "mage" || this.unitClass == "Mage")
        {
            this.validMoves = [{ x: -3, z: 0 }, { x: -2, z: 0 }, { x: -2, z: -1 }, { x: -2, z: 1 },
            { x: -1, z: -2 }, { x: -1, z: -1 }, { x: -1, z: 0 }, { x: -1, z: 1 }, { x: -1, z: 2 },
            { x: 0, z: 0 }, { x: 0, z: -3 }, { x: 0, z: -2 }, { x: 0, z: -1 }, { x: 0, z: 1 }, { x: 0, z: 2 }, { x: 0, z: 3 },
            { x: 1, z: 0 }, { x: 1, z: -2 }, { x: 1, z: -1 }, { x: 1, z: 1 }, { x: 1, z: 2 },
            { x: 2, z: 0 }, { x: 2, z: -1 }, { x: 2, z: 1 }, { x: 3, z: 0 }, ]
        }
        return this.validMoves;
    }

    this.setAttacks = function()
    {
        if (this.unitClass == "ranger" || this.unitClass == "Ranger")
        {
            this.validAttacks = new Array;
            for (x = 2; x < 6; x++) {
                var tempPos = { x: 0, z: 0 };
                var tempNeg = { x: -1, z: 0 };
                tempPos.x = x;
                tempNeg.x = -1 * x;
                this.validAttacks.push(tempPos);
                this.validAttacks.push(tempNeg);
            }
            for (z = 2; z < 6; z++) {
                var tempPos = { x: 0, z: 0 };
                var tempNeg = { x: -1, z: 0 };
                tempPos.z = z;
                tempNeg.z = -1 * z;
                this.validAttacks.push(tempPos);
                this.validAttacks.push(tempNeg);
            }

            for (i = 2; i < 6; i++) {
                var tempPos = { x: 0, z: 0 };
                var tempNeg = { x: -1, z: -1 };
                var tempNegX = { x: -1, z: 0 };
                var tempNegZ = { x: 0, z: -1 };

                tempPos.x = i;
                tempPos.z = i;
                this.validAttacks.push(tempPos);

                tempNeg.x = i * -1;
                tempNeg.z = i * -1;
                this.validAttacks.push(tempNeg);

                tempNegX.x = -1 *i;
                tempNegX.z = i;
                this.validAttacks.push(tempNegX);

                tempNegZ.x = i;
                tempNegZ.z = i* -1;
                this.validAttacks.push(tempNegZ);

            }
        }

        if (this.unitClass == "warrior" || this.unitClass == "Warrior")
        {
            this.validAttacks = new Array;
            var x = -1; 
            while ( x < 2)
            {
                var z = -1;
                while (z < 2)
                {
                    var tempPos = { x: 0, z: 0 };
                    tempPos.x = x;
                    tempPos.z = z;
                    this.validMoves.push(tempPos)
                    z++
                }
                x++;
            }
        }

        if (this.unitClass == 'mage' || this.unitClass == 'Mage')
        {
            this.validAttacks = [{ x: -3, z: 0 }, { x: -2, z: 0 }, { x: -2, z: -1 }, { x: -2, z: 1 },
            { x: -1, z: -2 }, { x: -1, z: -1 }, { x: -1, z: 0 }, { x: -1, z: 1 }, { x: -1, z: 2 },
            { x: 0, z: 0 }, { x: 0, z: -3 }, { x: 0, z: -2 }, { x: 0, z: -1 }, { x: 0, z: 1 }, { x: 0, z: 2 }, { x: 0, z: 3 },
            { x: 1, z: 0 }, { x: 1, z: -2 }, { x: 1, z: -1 }, { x: 1, z: 1 }, { x: 1, z: 2 },
            { x: 2, z: 0 }, { x: 2, z: -1 }, { x: 2, z: 1 }, { x: 3, z: 0 }, ]
        }

        return this.validAttacks;
    }

    this.critical = function (unit1, unit2) {
        /* 
            function to determine if the class has advantage over the other. 
            Warrior trumps Ranger
            Mage trumps Warrior
            Ranger trumps Mage
         */
        if (ununit2.unitClass == "Warrior" || unit2.unitClass == "warrior") {
            if (unit2.unitClass == "Ranger" || unit2.unitClass == "ranger") {
                return true;
            }
            else {
                return false;
            }
        }
        else if (unit1.unitClass == "Mage" || unit1.unitClass == "mage") {
            if (unit2.unitClass == "Warrior" || unit2.unitClass == "warrior")
                return true;
            else
                return false;
        }
        else {
            // assuming the last class is Ranger
            if (unit1.unitClass == "Mage" || unit1.unitClass == "mage")
                return true;
            else
                return false;
        }
    }

    this.combat = function (attacker, defender, counter) {
        if (attacker.critical(attacker, defender)) {
            defender.health -= attacker.criticalDamage;
        }
        else {
            defender.health -= attacker.baseDamage;
        }

        // boolean flag should help distinguish whether this is a counter or not 
        // true for attacker's initial move
        // false for defender's counter.
        if (counter === true) {
            if (defender.health > 0) {
                defender.combat(defender, attacker, false);
            }
            else {
                // do nothing? Kill the unit should be checked at the end. 
            }
        }

        if (defender.heatlh < 0) {
            defender.destroyUnit();
        }

        // we're done.
        return;
    }

    this.destroyUnit = function () {
        // function that will remove the unit from the board. 
        // dunno if we can destroy the unit from here. 
        //We'll just mark the unit for death. 
        this.isDead = true;
        
    }

}

