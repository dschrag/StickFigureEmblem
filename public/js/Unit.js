

class Unit { 
    /*
    var health; 
	var baseDamage;
	var critDamage; 
	var unitClass;
    var isDead: flag for checking if the unit is dead. 
    */
	constructor(unitClass){
	    this.unitClass = unitClass;
	    this.isDead = false; 
		if (unitClass == "Warrior")
		{
            // Warrior specific attributes. 

		    this.health = 250; // strongest health

		}
		else if (unitClass == "Mage")
		{
            // Mage specific attributes. 

		    // I took the average of 250 + 125 to try and rounded to the nearest 10's place
            // so this class could reflect a balance of the two other classes. 
		    this.health = 190;

		}
		else if (unitClass == "Ranger")
		{
            // Ranger specific attributes

		    this.health = 125 // weakest health. 

		}
		else {
            // not sure what to do here. 
		    console.error("Class was not a defined class. ");
		}
        this.baseDamage = 45 // may change to differ with classes classes. 
		this.criticalDamage = this.baseDamage * 1.5; // start off with 1.5 damage modifier for crit damage
	}
    
    critical(unit1, unit2)
    {
        /* 
           function to determine if the class has advantage over the other. 
           Warrior trumps Ranger
           Mage trumps Warrior
           Ranger trumps Mage
        */
        if (unit1.unitClass == "Warrior") {
            if (unit2.unitClass == "Ranger") {
                return true; 
            }
            else 
            {
                return false; 
            }
        }
        else if (unit1.unitClass == "Mage")
        {
            if (unit2.unitClass == "Warrior")
                return true;
            else
                return false;
        }
        else
        {
            // assuming the last class is Ranger
            if (unit2.unitClass == "Mage")
                return true;
            else
                return false;
        }
    }

    combat(attacker, defender, counter)
    {
        if (attacker.critical(attacker, defender))
        {
            defender.health -= attacker.criticalDamage;
        }
        else 
        {
            defender.health -= attacker.baseDamage;
        }

        // boolean flag should help distinguish whether this is a counter or not 
        // true for attacker's initial move
        // false for defender's counter.
        if (counter === true)
        {
            if (defender.health > 0) {
                defender.combat(defender, attacker, false);
            }
            else {
                // do nothing? Kill the unit should be checked at the end. 
            }
        }

        if (defender.heatlh < 0)
        {
            defender.destroyUnit();
        }

        // we're done.
        return; 
    }

    destroyUnit()
    {
        // function that will remove the unit from the board. 
        // dunno if we can destroy the unit from here. 
        //We'll just mark the unit for death. 
        this.isDead = true; 
    }
	
}

