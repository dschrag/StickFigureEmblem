
/*
   Unit Class documentation
   Written by:
        Daniel Miller (dmiller4991@gmail.com)
        Derek Schrag (dschrag@purdue.edu)
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
    this.canMove = true;
    this.canAttack = true; 

    if (unitClass == "warrior" || unitClass == "Warrior") {
        // Warrior specific attributes. 

        this.health = 250; // strongest health
        //this.health = 1;
    }
    else if (unitClass == "mage" || unitClass == "Mage") {
        // Mage specific attributes. 

        // decrementing by 60
        this.health = 190;
        //this.health = 1;
    }
    else if (unitClass == "ranger" || unitClass == "Ranger") {
        // Ranger specific attributes

        this.health = 130 // weakest health. 
        //this.health = 1;
    }
    else {
        // not sure what to do here. 
        console.error("unitClass was not a defined class.");
    }
    this.baseDamage = 42 // may change to differ with classes classes. 
    this.criticalDamage = this.baseDamage * 1.5; // start off with 1.5 damage modifier for crit damage

    this.setShadow = function (shadow) {
        this.unitShadow = shadow;
    }

    this.setModel = function (model) {
        this.unitModel = model;
    }

    this.setPosition = function (posx, posz)
    {
        this.position.x = posx;
        this.position.z = posz;
    }

    this.cantMove = function () {
        this.canMove = false;
    }
    
    this.cantAttack = function () {
        this.canAttack = false;
        this.canMove = false;
    }

    this.setMoves = function ()
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

            this.validAttacks = [{ x: -5, z: 0 }, { x: -4, z: 0 }, { x: -3, z: 0 }, { x: -2, z: 0 },
                { x: 5, z: 0 }, { x: 4, z: 0 }, { x: 3, z: 0 }, { x: 2, z: 0 },
                { x: 0, z: -5 }, { x: 0, z: -4 }, { x: 0, z: -3 }, { x: 0, z: -2 },
                { x: 0, z: 5 }, { x: 0, z: 4 }, { x: 0, z: 3 }, { x: 0, z: 2 },
                { x: 4, z: 4 }, { x: 3, z: 3 }, { x: 2, z: 2 },
                { x: -4, z: 4 }, { x: -3, z: 3 }, { x: -2, z: 2 },
                { x: 4, z: -4 }, { x: 3, z: -3 }, { x: 2, z: -2 },
                { x: -4, z: -4 }, { x: -3, z: -3 }, { x: -2, z: -2 }, ]
        }

        if (this.unitClass == "warrior" || this.unitClass == "Warrior")
        {
            this.validAttacks = new Array;
            var x = -1;
            while (x < 2) {
                var z = -1;
                while (z < 2) {
                    var tempPos = { x: 0, z: 0 };
                    tempPos.x = x;
                    tempPos.z = z;
                    this.validAttacks.push(tempPos)
                    z++;
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
        console.log("Checking crits")
        console.log("unit2 class: " + unit2.unitClass);
        console.log("unit1 class: " + unit1.unitClass);
        if (unit1.unitClass == "Warrior" || unit1.unitClass == "warrior") {
            if (unit2.unitClass == "Ranger" || unit2.unitClass == "ranger") {
                console.log("Critical Damage!")
                return true;
            }
            else {
                return false;
            }
        }
        if (unit1.unitClass == "Mage" || unit1.unitClass == "mage") {
            if (unit2.unitClass == "Warrior" || unit2.unitClass == "warrior") {
                console.log("Critical Damage!")
                return true;
            }
            else
                return false;
        }
        if (unit1.unitClass == "Ranger" || unit1.unitClass == "ranger"){
            // assuming the last class is Ranger
            if (unit2.unitClass == "Mage" || unit2.unitClass == "mage") {
                console.log("Critical Damage!")
                return true;
            }
            else
                return false;
        }
    }

    this.combat = function (attacker, defender, counter) {
        if (defender.isDead) {
            console.log("You can't kill what is dead");
            return;
        }
        console.log("beginning fights")
        if (attacker.critical(attacker, defender)) {
            defender.health -= attacker.criticalDamage;
        }
        else {
            console.log("normal hit")
            defender.health -= attacker.baseDamage;
        }

        // boolean flag should help distinguish whether this is a counter or not 
        // true for attacker's initial move
        // false for defender's counter.
        if (counter === true) {
            console.log("beginning counter attack.")
            console.log("Defender hp: " + defender.health)
            if ((defender.health > 0) && defender.canReachTile(attacker.position)) {
                defender.combat(defender, attacker, false);
            }
            else {
                // do nothing? Kill the unit should be checked at the end. 
            }
        }

        if (defender.health < 0) {
            console.log("He's dead Jim")
            defender.destroyUnit();
        }

        // we're done.
        return;
    }
	
	this.canReachTile = function(tile) {
		for (var i = 0; i < this.validAttacks.length; i++) {
			console.log("Checking if unit can counter attack");
			if (((this.position.x + this.validAttacks[i].x) === tile.x) && ((this.position.z + this.validAttacks[i].z) === tile.z)) {
				console.log(this.unitClass + " can counter attack!");
				return true;	
			}
		}
	}

    this.destroyUnit = function () {
        // function that will remove the unit from the board. 
        // dunno if we can destroy the unit from here. 
        //We'll just mark the unit for death. 
        this.isDead = true;
        
    }

}
