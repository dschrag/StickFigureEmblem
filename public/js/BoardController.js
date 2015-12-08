// Javascript document
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
	var ranger, mage, warrior, gameboard, ground;
	
	var containerEl = options.containerEl || null;
	var assetsUrl = options.assetsUrl || '';
	
	this.drawBoard = function (callback) {
		initEngine(); 											// initializes graphics renderer
		initBoardArray();										// sets up gameboard array
		initLights();	
		initMaterials();							
		initObjects(function () {								// initializes game board and units
            onAnimationFrame();
			callback();
        });		
		initListeners();
	};
	
	this.addUnit = function (oonit) {
	    var unitMesh = new THREE.Mesh(ranger);
	    oonit.setModel(unitMesh);
		var unitTeam = new THREE.Object3D();
		
		if (oonit.color === 1) {
			unitTeam.color = SFE.BLUE;
			unitMesh.material = materials.board;	
		} else {
			unitTeam.color = SFE.GREEN;
			unitMesh.material = materials.darkgrass;	
		}
		
		var shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(tileSize, tileSize, 1, 1), materials.ground);
		shadowPlane.rotation.x = -90 * Math.PI / 180;
		
		unitTeam.add(unitMesh);
		unitTeam.add(shadowPlane);
		
		var vp = boardToWorld(oonit.pos);
		unitTeam.position.set(vp.x, vp.y, vp.z);
		board[oonit.pos[0]][oonit.pos[1]] = unitTeam;
		
		scene.add(unitTeam);	
	};
	
	function initEngine() {
		var sceneWidth = containerEl.offsetWidth;
		var sceneHeight = containerEl.offsetHeight;
		console.log("Initialized sceneWidth: " + sceneWidth + "sceneHeight: " + sceneHeight);
		
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(sceneWidth, sceneHeight);
		console.log("Initialized renderer");
		
		projector = new THREE.Projector();
		
		scene = new THREE.Scene();
		console.log("Initialized Scene");
		
		camera = new THREE.PerspectiveCamera(45, sceneWidth / sceneHeight, 1, 1000);
		camera.position.set(100, 100, 300);
		cameraController = new THREE.OrbitControls(camera, containerEl);
		cameraController.target.set(100, -0.5, 100);
		console.log("Initialized Camera");
		
		scene.add(camera);
		containerEl.appendChild(renderer.domElement);
	}
	
	function initBoardArray() {
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
		lights.topLight = new THREE.PointLight();
		lights.topLight.position.set(tileSize * 4, 150, tileSize * 4);
		lights.topLight.intensity = 1.0;
		
		scene.add(lights.topLight);
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
		
		materials.lightgrass = new THREE.MeshLambertMaterial({
			map: THREE.ImageUtils.loadTexture(assetsUrl + 'lightgrass.jpg')
		});
	}

	function initObjects(callback) {
		var loader = new THREE.JSONLoader();
		var totalObjectsToLoad = 2;
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
			scene.add(gameboard);
			checkLoad();
		});
		
		loader.load(assetsUrl + 'ranger.json', function (geom) {
			ranger = geom;
			//ranger1.position.set(5,0,5);
			//scene.add(ranger1);
			checkLoad();
		});
		
		ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), materials.ground);
		ground.position.set(tileSize * 4, -1.52, tileSize * 4);
		ground.rotation.x = -90 * Math.PI / 180;
		scene.add(ground);
		
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
		var domElement = renderer.domElement;
		
		domElement.addEventListener('mousedown', onMouseDown, false);
		domElement.addEventListener('mouseup', onMouseUp, false);
	}

	function onAnimationFrame() {
		requestAnimationFrame(onAnimationFrame);
		//console.log(camera.getWorldDirection());
		cameraController.update();
		renderer.render(scene, camera);	
	}
	
	function boardToWorld (pos) {
		var x = (1 + pos[1]) * tileSize - tileSize / 2;
		var z = (1 + pos[0]) * tileSize - tileSize / 2;
		return new THREE.Vector3(x, 0, z);	
	}
	
	function worldToBoard(pos) {
		console.log(pos);
		var i = boardLength - Math.ceil((tileSize * boardLength - pos.z) / tileSize);
		var j = Math.ceil(pos.x / tileSize - 1);
		console.log(i);
		if (j === -0) j = 0;
		console.log(j);
		
		if (i > (boardLength - 1) || i < 0 || j > (boardWidth - 1) || j < 0 || isNaN(i) || isNaN(j)) {
			return false;	
		}
		return [i, j];
	}
	
	function onMouseDown(event) {
		var mouse3D = getMouse3D(event);
		
		if (isMouseOnBoard(mouse3D)) {
			if (isUnitOnMousePosition(mouse3D)) {
				calculateActions(worldToBoard(mouse3D));
				console.log("Yay");
				//renderer.domElement.addeventListener('mousemove', onMouseMove, false);	
			}
			cameraController.userRotate = false;	
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
				console.log("Mouse on board");
            return true;
        } else {
            return false;
        }
    }
	
	function isUnitOnMousePosition(pos) {
		var boardPos = worldToBoard(pos);
		console.log("mouseBoardPos: " + boardPos[0] + " " + boardPos[1]);
		
		return isUnitAtTile(boardPos);
	}
	
	var unitPossibleMoves = [];

	function calculateActions (pos) {
	
		unitPossibleMoves.push({x: 1, z: 1});
		unitPossibleMoves.push({x: 1, z: 2});
		unitPossibleMoves.push({x: 0, z: 1});
		unitPossibleMoves.push({x: 0, z: 2});
		
		console.log(pos);
	  // check each possible move for the unit
	  for (var i = 0; i < unitPossibleMoves.length; i++) {
		var movePos = unitPossibleMoves[i];
		var tilePos = [];
		tilePos[0] = pos[0] + movePos.x;
		tilePos[1] = pos[1] + movePos.z;
		if (tilePos[0] >= 0 && tilePos[0] < 20 && tilePos[1] >= 0 && tilePos[1] < 20) {
			if (!isUnitAtTile(tilePos)) {
				console.log("movePos.x: " + movePos.x + " z: " + movePos.z + ", tilePos: " + tilePos[0] + " z: " + tilePos[1]);
				tiles[tilePos[0]][tilePos[1]].material = materials.board;	
			}
		}
	  }
  
}
	
	function isUnitAtTile(boardPos) {
		console.log("boardPos: " + boardPos);
		var x = boardPos[0];
		var z = boardPos[1];
		if (boardPos && (board[x][z] !== 0)) {
			console.log("Unit here! Belongs to: " + board[boardPos[0]][boardPos[1]].color);
			//tiles[boardPos[0]][boardPos[1]].material = materials.board;
			return true;
		} else {
			return false;
		}
	}
};

