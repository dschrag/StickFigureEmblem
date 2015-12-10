// Javascript document
var unitArray = [];
var Player1 = new Player(1);
var Player2 = new Player(2);
var currentPlayer; 
var unitGUI, unitHoverGUI, turnGUI;
var turnsElapsed = 0;
SFE.BoardController = function (options) {
	'use strict';

	options = options || {};

	// WebGL Rendering Variables
	var renderer, scene, camera, cameraController, projector;

	// Assets Variables
	var lights = {};
	var materials = {};

	// Board size
	var tileSize = 10;
	var boardLength = 20;
	var boardWidth = 20;
	var board = [];
	var tiles = [];

	// Unit variables
	var ranger, mage, warrior, gameboard, ground, skyboxMesh;
	var selectedUnit, notyourunit, hoveredUnit;
	var hoverGUIContainer;
	
	var combatLog, numMessages;
	var containerEl = options.containerEl || null;
	var assetsUrl = options.assetsUrl || '';

    // audio stuff
	var audio;
	var source;
	var counter = 0;

	this.drawBoard = function (callback) {
		initEngine(); 											// initializes graphics renderer
		initBoardArray();										// sets up gameboard array
		initLights();
		initMaterials();
		initSkybox();
		initObjects(function () {								// initializes game board and units
            onAnimationFrame();
			callback();
		});
		initGUIS();
		initListeners();
		initAudio();

		alert("Let the games begin!");
	};

	this.addUnit = function (oonit) {
		var unitMesh;
		if (oonit.unitClass == "ranger" || oonit.unitClass == "Ranger") {
		    unitMesh = new THREE.Mesh(ranger);
		} else if (oonit.unitClass == "warrior" || oonit.unitClass == "Warrior") {
			unitMesh = new THREE.Mesh(warrior);
		} else {
			unitMesh = new THREE.Mesh(mage);
		}
		oonit.setModel(unitMesh);
		var unitTeam = new THREE.Object3D();

		if (oonit.pOwner === 1) {
			unitMesh.material = materials.blueteam;
		} else {
			unitMesh.material = materials.redteam;
			unitTeam.rotation.y = 180 * Math.PI / 180;
		}

		var shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(tileSize, tileSize, 1, 1), materials.ground);
        oonit.setShadow(shadowPlane)
		shadowPlane.rotation.x = -90 * Math.PI / 180;
		shadowPlane.position.y = -4.5;
		oonit.position.y = 4.5;

		unitTeam.add(unitMesh);
		unitTeam.add(shadowPlane);

		var vp = boardToWorld(oonit.position);
		unitTeam.position.set(vp.x, oonit.position.y, vp.z);
		//console.log("oonit.pos.x " + oonit.position.x);
		//console.log("oonit.pos.z " + oonit.position.z);
		//console.log("oonit moves: " + oonit.validMoves);
		board[oonit.position.x][oonit.position.z] = unitTeam;
		scene.add(unitTeam);
	};

	function initGUIS() {
	    currentPlayer = Player1;
	    turnGUI = new dat.GUI();
	    var text = {
	        number: currentPlayer.playerNum,
	        endTurn: function () { endTurn();}
	    };

	    turnGUI.add(text, 'number').name("Currently Playing");
	    turnGUI.add(text, 'endTurn').name("End Turn");
		
		var hoverGUIContainer = document.createElement('div');
		hoverGUIContainer.className = "hover-gui";
	}

	function endTurn() {
	    //turnsElapsed++;
	    currentPlayer.changeTurn();
	    if (currentPlayer == Player1) {
	        currentPlayer = Player2;
	    }
	    else
	        currentPlayer = Player1;

	    turnGUI.destroy();
	    turnGUI = new dat.GUI();
	    var text = {
	        number: currentPlayer.playerNum,
	        endTurn: function () { endTurn(); }
	    };

	    turnGUI.add(text, 'number').name("Currently Playing");
	    turnGUI.add(text, 'endTurn').name("End Turn");

	    var i = 0;
	    for (i = 0; i < unitArray.length; i++) {
	        unitArray[i].canAttack = true;
	        unitArray[i].canMove = true;
	    }		

	}

	function initEngine() {
		var sceneWidth = containerEl.offsetWidth;
		var sceneHeight = containerEl.offsetHeight;
		console.log("Initialized sceneWidth: " + sceneWidth + "sceneHeight: " + sceneHeight);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(sceneWidth, sceneHeight);
		console.log("Initialized renderer");

		scene = new THREE.Scene();
		console.log("Initialized Scene");

		camera = new THREE.PerspectiveCamera(45, sceneWidth / sceneHeight, 1, 2000);
		camera.position.set(100, 100, 300);
		cameraController = new THREE.OrbitControls(camera, containerEl);
		cameraController.target.set(100, -0.5, 100);
		console.log("Initialized Camera");

		scene.add(camera);
		containerEl.appendChild(renderer.domElement);
		
		combatLog = document.getElementById("combatLog");
		combatLog.innerHTML = "Combat Log";
		
		console.log(combatLog);
	}

	function initBoardArray() {
        console.log("initing board array")
		unitArray[10] = 0;
		selectedUnit = unitArray[10];
		var prnt = '';
		for (var i = 0; i < boardLength; i++) {
			board[i] = [boardWidth];
			tiles[i] = [boardWidth];
			for (var j = 0; j < boardWidth; j++) {
				board[i][j] = 0;
				prnt += board[i][j] + ',';
			}
			prnt += '\n';
		}
		//console.log(prnt);
	}

	function initLights() {
	    // Sun
        console.log("Praise the Sun")
		lights.topLight = new THREE.PointLight();
		lights.topLight.position.set(tileSize * 4, 150, tileSize * 4);
		lights.topLight.intensity = 1.0;

		lights.whiteSideLight = new THREE.SpotLight();
		lights.whiteSideLight.position.set(tileSize * 4, 100, tileSize * 4 + 500);
		lights.whiteSideLight.intensity = 0.8;
		lights.whiteSideLight.shadowCameraFov = 55;

	    // black's side light
		lights.blackSideLight = new THREE.SpotLight();
		lights.blackSideLight.position.set(tileSize * 4, 100, tileSize * 4 - 500);
		lights.blackSideLight.intensity = 0.8;
		lights.blackSideLight.shadowCameraFov = 55;

	    // light that will follow the camera position
		lights.movingLight = new THREE.PointLight(0xf9edc9);
		lights.movingLight.position.set(0, 10, 0);
		lights.movingLight.intensity = 0.5;
		lights.movingLight.distance = 500;
        
		scene.add(lights.topLight);
		scene.add(lights.whiteSideLight);
		scene.add(lights.blackSideLight);
		scene.add(lights.movingLight);
    
	}

	function initMaterials() {
	materials.board = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture(assetsUrl + 'board.jpg')
	});

	materials.ground = new THREE.MeshBasicMaterial({
				transparent: true,
				map: THREE.ImageUtils.loadTexture(assetsUrl + 'ground.png')
		});

	materials.darkgrass = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(assetsUrl + 'darkgrass.jpg')
	});

	materials.darkgrass_red = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(assetsUrl + 'darkgrass_red.jpg')
	});

	materials.darkgrass_green = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(assetsUrl + 'darkgrass_green.jpg')
	});

	materials.lightgrass = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(assetsUrl + 'lightgrass.jpg')
	});

	materials.lightgrass_red = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(assetsUrl + 'lightgrass_red.jpg')
	});

	materials.lightgrass_green = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(assetsUrl + 'lightgrass_green.jpg')
	});

	materials.redteam = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(assetsUrl + 'redteam.jpg')
	});

	materials.blueteam = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(assetsUrl + 'blueteam.jpg')
	});

}

	function sendToCombatLog(data) {
		combatLog.innerHTML += "<br />" + data;
		combatLog.scrollTop = combatLog.scrollHeight;
	}

	function initSkybox() {
		var skyboxURLs = [
	 assetsUrl + 'ely_hills/hills_rt.jpg', assetsUrl + 'ely_hills/hills_lf.jpg', assetsUrl + 'ely_hills/hills_up.jpg', assetsUrl + 'ely_hills/hills_dn.jpg', assetsUrl + 'ely_hills/hills_bk.jpg', assetsUrl + 'ely_hills/hills_ft.jpg'
	];
		// px, nx, py, ny, pz, nz, right, left, up, down, front, back
		var materialArray = [];
		for (var i = 0; i < 6; i++) {
			materialArray.push(new THREE.MeshBasicMaterial({
                 map: THREE.ImageUtils.loadTexture(skyboxURLs[i]),
                 side: THREE.BackSide
            }));	
	}
	
	var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
	var skyGeometry = new THREE.CubeGeometry(1900, 1900, 1900);
	var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
	
	scene.add(skyBox);
	}

	function initObjects(callback) {
        console.log("Initing Objects")
		var loader = new THREE.JSONLoader();
		var totalObjectsToLoad = 4;
		var loadedObjects = 0;

		function checkLoad() {
			loadedObjects++;

			if (loadedObjects === totalObjectsToLoad && callback) {
				console.log("Calling Back");
				callback();
			}
		}

		loader.load(assetsUrl + 'board.js', function (geom) {
			gameboard = new THREE.Mesh(geom, materials.board);
			gameboard.position.y = -0.02;
			gameboard.scale.x = 2.5;
			gameboard.scale.z = 2.5;
			scene.add(gameboard);
			checkLoad();
		});

		loader.load(assetsUrl + 'ranger.json', function (geom) {
			ranger = geom;
			checkLoad();
		});

		loader.load(assetsUrl + 'warrior.json', function (geom) {
			warrior = geom;
			checkLoad();
		});

		loader.load(assetsUrl + 'mage.json', function (geom) {
			mage = geom;
			checkLoad();
		});

		var tileMaterial = materials.darkgrass;

		for (var i = 0; i < boardLength; i++) {
			for (var j = 0; j < boardWidth; j++) {
				if ((i + j) % 2 === 0) {
					tileMaterial = materials.lightgrass;
				} else {
					tileMaterial = materials.darkgrass;
				}

				var tile = new THREE.Mesh(new THREE.PlaneGeometry(tileSize, tileSize, 1, 1), tileMaterial);
				tile.position.x = j * tileSize + tileSize / 2;
				tile.position.z = i * tileSize + tileSize / 2;
				tile.position.y = -0.01;
				tile.rotation.x = -90 * Math.PI / 180;
				tiles[i][j] = tile;
				//console.log("[" + i + "," + j + "]: " + "(" + tile.position.x + "," + tile.position.z + ")");

				scene.add(tile);
			}
		}

		callback();
	}

	function initListeners() {
        console.log("initing listeners")
		var domElement = renderer.domElement;

		domElement.addEventListener('mousedown', onMouseDown, false);
		domElement.addEventListener('mouseup', onMouseUp, false);
		domElement.addEventListener('mousemove', onMouseMove, false);
	}

	function initAudio() {
	    console.log("initing Audio");
	    audio = document.createElement('audio');
	    source = document.createElement('source');
	    source.src = "sounds/Forest-Chase.mp3";
	    audio.appendChild(source);
	    audio.play();
        console.log("audio done")
	}

	function onAnimationFrame() {
		requestAnimationFrame(onAnimationFrame);
		//console.log(camera.getWorldDirection());
		cameraController.update();
		renderer.render(scene, camera);
		checkAudio();
		floatDeadUnit();
		//checkWinningState();
	}

	function checkAudio() {
        //console.log("checking audio counter: " + counter)
	    if (counter > 5800) {
	        counter = 0;
	        audio.play();
	    }
	    else
	        counter++;
	}
	
	function sendScore(name, score) {
	    //console.log("sending score");
		var xmlHttp = new XMLHttpRequest();
		var scoreURL = "/save_score?name=" + name + "&score=" + score;
   		xmlHttp.open( "GET", scoreURL, false ); // false for synchronous request
   		xmlHttp.send(null);
    	return xmlHttp.responseText;
	}

	function checkWinningState() {
	    if (Player1.numUnits == 0) {
	        Player2.winner = true;
	        sendToCombatLog("This game's winner is: Player 2!");
	        console.log("Gonna send a score");
	        Player2.calculateScore();
	        console.log("Player2 score:");
	        console.log(Player2.score);
	        var finalScore = Player2.score;
	        sendScore("Grr", finalScore);
            //console.log("done w/ GRR")
		}
	    else if (Player2.numUnits == 0) {
	        Player1.winner = true;
	        sendToCombatLog("This game's winner is: Player 1!");
	        console.log("Gonna send a score");
	        Player1.calculateScore();
	        console.log("Player1 score:");
	        console.log(Player1.score);
	        var finalScore = Player1.score;
	        sendScore("Seh", finalScore);
            //console.log("done w/ SEH")
		   // alert("Player 1 Wins! Please refresh the page");
	    }
		
	}

	function boardToWorld(pos) {
	    //console.log("Board to world with " + pos);
		var x = (1 + pos.z) * tileSize - tileSize / 2;
		var z = (1 + pos.x) * tileSize - tileSize / 2;
		return new THREE.Vector3(x, 0, z);
	}

	function worldToBoard(pos) {
		//console.log("world to board with " + pos.x + ", " + pos.z);
		var i = boardLength - Math.ceil((tileSize * boardLength - pos.z) / tileSize);
		var j = Math.ceil(pos.x / tileSize - 1);
		//console.log(i);
		if (j === -0) j = 0;
		//console.log(j);

		if (i > (boardLength - 1) || i < 0 || j > (boardWidth - 1) || j < 0 || isNaN(i) || isNaN(j)) {
			return false;
		}
		var position = {x:0, z:0};
		position.x = i;
		position.z = j;
		return position;
	}

	function resetTiles() {
		var tileMaterial;

		for (var i = 0; i < boardLength; i++) {
			for (var j = 0; j < boardWidth; j++) {
				if ((i + j) % 2 === 0) {
					tileMaterial = materials.lightgrass;
				} else {
					tileMaterial = materials.darkgrass;
				}

				tiles[i][j].material = tileMaterial;
			}
		}
	}

	function tileIsMovableTo(t) {
		//console.log(t.z);
	    if 	(tiles[t.x][t.z].material === materials.darkgrass_green || tiles[t.x][t.z].material === materials.lightgrass_green) {
		    console.log("Can move here");
		    return true;
	    } else {
		    return false;
	    }
	}

	function tileisAttackable(t) {
	    console.log("Can we attack " + t)
	    console.log(tiles[t.x][t.z])
	    if (tiles[t.x][t.z].material === materials.darkgrass_red || tiles[t.x][t.z].material === materials.lightgrass_red) {
            console.log("can attack")
	        return true;
	    }
	    else {
            console.log("Enemies missing")
	        return false;
	    }
	}
	
	function onMouseMove(event) {
		var mouse3D = getMouse3D(event);
		if (isUnitOnMousePosition(mouse3D)) {
			var unit = findUnit(worldToBoard(mouse3D));
			if (hoveredUnit === undefined) {
				spawnUnitHoverGUI(unit);
				hoveredUnit = unit;	
			}
			else if (unit.position !== hoveredUnit.position) {
				unitHoverGUI.destroy();	
				spawnUnitHoverGUI(unit);
				hoveredUnit = unit;
			}
				
		}
		
	}


function onMouseDown(event) {
    var mouse3D = getMouse3D(event);

    if (isMouseOnBoard(mouse3D)) {
	    if (isUnitOnMousePosition(mouse3D) && selectedUnit === unitArray[10]) { // THIS IS THE FIRST CLICK, where a unit is not selected
		    //console.log(unitArray);
		    setSelectedUnit(worldToBoard(mouse3D));
		    //console.log("Selected unit: ");
	        //console.log(selectedUnit);
		    if (selectedUnit.canAttack)
		        calculateActions(worldToBoard(mouse3D), selectedUnit.validAttacks, "attack");

            if (selectedUnit.canMove)
                calculateActions(worldToBoard(mouse3D), selectedUnit.validMoves, "move");

	
	    } else if (selectedUnit !== undefined) { // IF A UNIT IS SELECTED THOUGH
		    //console.log("Unit is selected");
	        var tileSelected = worldToBoard(mouse3D); 				// Get the position of the tile the unit wants to go to
	        if (board[tileSelected.x][tileSelected.z] === 0 && tileIsMovableTo(tileSelected)) { // if there is not a unit in the board at that position, and the tile is able to be moved to (based off the units available moves
	            if (selectedUnit.canMove) {
	                var op = selectedUnit.position;								// original position (world)
	                var vp = boardToWorld(tileSelected); 						// get new coordinates for units position
	                board[op.x][op.z].position.set(vp.x, op.y, vp.z); 			// set units new position
	                board[tileSelected.x][tileSelected.z] = board[op.x][op.z];	// set new board spot equal to the unit in the old board slot
	                board[op.x][op.z] = 0;
	                selectedUnit.setPosition(tileSelected.x, tileSelected.z);
	                selectedUnit.cantMove();
	                sendToCombatLog("Player " + selectedUnit.pOwner + "'s " + selectedUnit.unitClass + " has moved");
	            }
	            else 
	                console.log("Unit has already moved! ")
	        }
	        if (board[tileSelected.x][tileSelected.z] !== 0 && tileisAttackable(tileSelected)) {
	            if (selectedUnit.canAttack) {
	                var enemy = findUnit(tileSelected);
					sendToCombatLog("Player " + selectedUnit.pOwner + "'s " + selectedUnit.unitClass + " (HP: " + selectedUnit.health + ") has attacked " +
					"enemy's " + enemy.unitClass + " (HP: " + enemy.health + ")");
					
					//console.log("Enemy's " + enemy.unitClass + " (HP: " + enemy.health + ")");
	                console.log("FIGHT!")
	                selectedUnit.combat(selectedUnit, enemy, true);
	                selectedUnit.cantAttack();
	                console.log("Done fighting")
	                console.log("Enemy health: " + enemy.health);
	                console.log("Ally health: " + selectedUnit.health);
					sendToCombatLog("Player " + enemy.pOwner + "'s " + enemy.unitClass + "HP: " + enemy.health + 
					", Player " + selectedUnit.pOwner + "'s " + selectedUnit.unitClass + "HP: " + selectedUnit.health);
					
					
	                if (enemy.isDead) {
	                    console.log("It's time for this unit to die.")
	                    board[tileSelected.x][tileSelected.z] = 0;
	                    if (enemy.pOwner == 1) {
	                        Player1.killUnit();
	                    }
	                    else {
	                        Player2.killUnit();
	                    }
						sendToCombatLog("Player " + enemy.pOwner + "'s " + enemy.unitClass +  " died!");
						checkWinningState();
	                }
	                if (selectedUnit.isDead) {
	                    console.log("An ally has fallen while fighting")
	                    var dedx = selectedUnit.position.x;
	                    var dedz = selectedUnit.position.z;
	                    board[dedx][dedz] = 0;

	                    if (selectedUnit.pOwner == 1) {
	                        Player1.killUnit();
	                    }
	                    else {
	                        Player2.killUnit();
	                    }
						sendToCombatLog("Player " + selectedUnit.pOwner + "'s " + selectedUnit.unitClass + " has died!");
	                }

	            }
	        }
            console.log("wrapping up")
		    resetTiles();
		    selectedUnit = unitArray[10];
		   
		    if (unitGUI != undefined) {
                console.log("gonna destroy the gui")
                unitGUI.destroy();
                console.log("done")
		    }
		
	    }

	    cameraController.userRotate = false;
    }
}

    function floatDeadUnit() {
        var i;
        for (i = 0; i < unitArray.length; i++) {
            //console.log(i);
            if (unitArray[i] != undefined)
                //console.log(unitArray[i].isDead)
            if (unitArray[i] != undefined && unitArray[i].isDead) {
                //console.log("is ded")
                var ded = unitArray[i];
                if (ded.unitModel.position.y <= 1000) {
                    ded.unitModel.position.y += 1;
                    ded.unitShadow.position.y += 1;
                }
            }
        }
    }

	function onMouseUp(event) { 
		cameraController.userRotate = true;
	}

	function getMouse3D(mouseEvent) {
        var x, y;
        //
        if (mouseEvent.offsetX !== undefined) {
            x = mouseEvent.offsetX;
            y = mouseEvent.offsetY;
        } else {
            x = mouseEvent.layerX;
            y = mouseEvent.layerY;
        }

        var pos = new THREE.Vector3(0, 0, 0);
        var pMouse = new THREE.Vector3(
            (x / renderer.domElement.width) * 2 - 1,
           -(y / renderer.domElement.height) * 2 + 1, 1);
        //
        //projector.unprojectVector(pMouse, camera);
		pMouse.unproject(camera);

        var cam = camera.position;
        var m = pMouse.y / ( pMouse.y - cam.y );

        pos.x = pMouse.x + ( cam.x - pMouse.x ) * m;
        pos.z = pMouse.z + ( cam.z - pMouse.z ) * m;

        return pos;
    }

	function isMouseOnBoard(pos) {
        if (pos.x >= 0 && pos.x <= tileSize * boardLength &&
            pos.z >= 0 && pos.z <= tileSize * boardWidth) {
				//console.log("Mouse on board");
            return true;
        } else {
            return false;
        }
    }

	function isUnitOnMousePosition(pos) {
		var boardPos = worldToBoard(pos);
		//console.log("mouseBoardPos: " + boardPos.x + " " + boardPos.z);

		return isUnitAtTile(boardPos);
	}

	var unitPossibleMoves = [];

	function calculateActions (pos, unitPossibleMoves, action) {

	    console.log("CALCULATING AVAILABLE ACTIONS FOR " + action);
	    //console.log(unitPossibleMoves);
	    // check each possible move for the unit

	    if (action == "move") {
	        for (var i = 0; i < selectedUnit.validMoves.length; i++) {
	            var movePos = unitPossibleMoves[i];
	            var tilePos = {};
	            tilePos.x = pos.x + movePos.x;
	            tilePos.z = pos.z + movePos.z;
	            if (tilePos.x >= 0 && tilePos.x < 20 && tilePos.z >= 0 && tilePos.z < 20) {
	                if (!isUnitAtTile(tilePos)) {
	                    //console.log("movePos.x: " + movePos.x + " z: " + movePos.z + ", tilePos: " + tilePos.x + " z: " + tilePos.z);
	                    if ((tilePos.x + tilePos.z) % 2 === 0) {
	                        if (tiles[tilePos.x][tilePos.z].material != materials.lightgrass_red) {
	                            tiles[tilePos.x][tilePos.z].material = materials.lightgrass_green;
	                        }
	                    } else {
	                        if (tiles[tilePos.x][tilePos.z].material != materials.darkgrass_red) {
	                            tiles[tilePos.x][tilePos.z].material = materials.darkgrass_green;
	                        }
	                    }

	                }
	            }
	        }
	    }
	    if (action == "attack") {
            console.log("Valid attacks length" + selectedUnit.validAttacks.length)
	        for (i = 0; i < selectedUnit.validAttacks.length; i++) {
	            var attackPos = unitPossibleMoves[i];
                //console.log("AttackPos: " + attackPos.x + "," + attackPos.z)
	            var tilePos = {};
	            tilePos.x = pos.x + attackPos.x;
	            tilePos.z = pos.z + attackPos.z;
	            if (tilePos.x >= 0 && tilePos.x < 20 && tilePos.z >= 0 && tilePos.z < 20) {
	                if (isUnitAtTile(tilePos)) {
	                    var unitFound = findUnit(tilePos);
	                    console.log("owner at tilePos: " + unitFound.pOwner);
	                    if (unitFound.pOwner != selectedUnit.pOwner) {
	                        console.log("Found an enemy");
	                        if ((tilePos.x + tilePos.z) % 2 === 0) {
	                            tiles[tilePos.x][tilePos.z].material = materials.lightgrass_red;
	                        } else {
	                            tiles[tilePos.x][tilePos.z].material = materials.darkgrass_red;
	                        }
	                    }
	                    

	                }
	            }
	        }
	    }
}
	function findUnit(position) {
	    var unit = undefined;
	    var i = 0;
	    for (i = 0; i < unitArray.length; i++) {
	        //console.log(position.x);
	        //console.log(position.z);

	        var posx = unitArray[i].position.x;
	        var posz = unitArray[i].position.z;
	        //console.log("posx: " + posx);
	        //console.log("posz: " + posz);
	        if (position.x == posx && position.z == posz) {
                console.log("unit found")
	            unit = unitArray[i];
	            return unit;
	        }
	    }
        console.log("No unit found")
	    return unit;
	}
	function isUnitAtTile(boardPos) {
	    //console.log("is unit at boardPos: " + boardPos);
	    //console.log("boardPos.x " + boardPos.x);
	    //console.log("boardPos.z " + boardPos.z);
		var posx = boardPos.x;
		var posz = boardPos.z;
		//console.log("boards x,z" + board[posx][posz]);
		if (boardPos && (board[posx][posz] !== 0)) {
			console.log("Unit here! Belongs to: " + board[posx][posz].color);
			return true;
		} else {
            //console.log("Not found")
			return false;
		}
	}
	
	function setSelectedUnit(boardPos) {
	    if (notyourunit != undefined) {
	        notyourunit = undefined;
	        unitGUI.destroy();
	    }
	    for (var i = 0; i < unitArray.length; i++) {
	        console.log("unitArray.pOwner: " + unitArray[i].pOwner)
			if (boardPos.x === unitArray[i].position.x && boardPos.z === unitArray[i].position.z) {
			    console.log("Setting Selected Unit");
			    console.log("current player num");
			    console.log("" + currentPlayer.playerNum)
                console.log("unitArray.pOwner: " + unitArray[i].pOwner)
			    if (unitArray[i].pOwner == currentPlayer.playerNum) {
			        console.log("Found current player's unit");
			        selectedUnit = unitArray[i];
			        spawnUnitGUI(selectedUnit);
			        return true;
			    }
			    else {
			        notyourunit = unitArray[i];
                    spawnUnitGUI(notyourunit)
                    console.log("Not current player's unit")
			    }
				//console.log(selectedUnit.validMoves);
			    //return true;
			}
		}
		return false;
	}

	function spawnUnitGUI(unit) {

	    unitGUI = new dat.GUI();
	    var trump;
	    if (unit.unitClass == "warrior" || unit.unitClass == "Warrior") {
            trump = "Ranger"
	    }
	    if (unit.unitClass == "ranger" || unit.unitClass == "Ranger"){
            trump  = "Mage"
	    }
	    if (unit.unitClass == "mage" || unit.unitClass == "Mage") {
	        trump = "Warrior";
	    }
	    var text = {
	        job: unit.unitClass, 
	        health: unit.health,
	        owner: unit.pOwner,
            trump: trump

	    };

	    unitGUI.add(text, 'owner').name("Owned by Player ");
	    unitGUI.add(text, 'job').name("Unit class");
	    unitGUI.add(text, 'health').name("Current Health");
	    unitGUI.add(text, 'trump').name("Trumps units of this type");
	}
	
	function spawnUnitHoverGUI(unit) {

	    unitHoverGUI = new dat.GUI({autoplace: false});
		
	    var trump;
	    if (unit.unitClass == "warrior" || unit.unitClass == "Warrior") {
            trump = "Ranger"
	    }
	    if (unit.unitClass == "ranger" || unit.unitClass == "Ranger"){
            trump  = "Mage"
	    }
	    if (unit.unitClass == "mage" || unit.unitClass == "Mage") {
	        trump = "Warrior";
	    }
	    var text = {
	        job: unit.unitClass, 
	        health: unit.health,
	        owner: unit.pOwner,
            trump: trump

	    };

	    unitHoverGUI.add(text, 'owner').name("Owned by Player ");
	    unitHoverGUI.add(text, 'job').name("Unit class");
	    unitHoverGUI.add(text, 'health').name("Current Health");
	    unitHoverGUI.add(text, 'trump').name("Trumps units of this type");
		console.log(unitHoverGUI.domElement);
		
		var dv = document.getElementById("hoverGUI");
		console.log(dv);
		unitHoverGUI.domElement.id = "moveGUI";
	}
};
