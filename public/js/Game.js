// JavaScript Document
var SFE = {
    BLUE: 1,
    RED: 2
};

SFE.Game = function (options) {
	'use strict';

	options = options || {};

	var board = [];
	var boardLength = 20, boardWidth = 20;

	function initBoardArray() {
		var prnt = '';
		for (var i = 0; i < boardLength; i++) {
			board[i] = [boardWidth];
			for (var j = 0; j < boardWidth; j++) {
				board[i][j] = 0;
				prnt += board[i][j] + ',';
			}
			prnt += '\n';
		}
		//console.log(prnt);
	}

	var boardController = null; // private

	function init() {
		console.log("Initializing...");
		boardController = new SFE.BoardController({
			containerEl: options.containerEl,
			assetsUrl: options.assetsUrl
		});

		boardController.drawBoard(onBoardReady);
	}

	function onBoardReady() {
        console.log("Readying Board")
		var row, col, oonit;
		var unit;
		var unitIndex = 0;
		
        console.log("Player 1's units")
	    unit = new Unit("ranger");
		unit.pOwner = 1;
		unit.setPosition(10, 10);
		unit.setMoves();
		unit.setAttacks();
		unitArray[unitIndex] = unit;
		unitIndex++;
		oonit = { color: SFE.BLUE, pos: [0, 0] };
		board[0][0] = unit;
		boardController.addUnit(unit);

		unit = new Unit("mage");
		unit.pOwner = 1;
		unit.setPosition(10, 11);
		unit.setMoves();
		unit.setAttacks();
		unitArray[unitIndex] = unit;
		unitIndex++;
		oonit = { color: SFE.BLUE, pos: [1, 0] };
		board[1][0] = unit;
		boardController.addUnit(unit);

		unit = new Unit("warrior");
		unit.pOwner = 1;
		unit.setPosition(10, 12);
		unit.setMoves();
		unit.setAttacks();
		unitArray[unitIndex] = unit;
		unitIndex++;
		oonit = { color: SFE.BLUE, pos: [2, 0] };
		board[2][0] = unit;
		boardController.addUnit(unit);

		console.log("Player 2's units")
		unit = new Unit("Ranger");
		unit.pOwner = 2;
		unit.setPosition(11, 10);
		unit.setMoves();
		unit.setAttacks();
		unitArray[unitIndex] = unit;
		unitIndex++;
		oonit = { color: SFE.RED, pos: [19, 19] };
		board[19][19] = unit;
		boardController.addUnit(unit);

		unit = new Unit("mage");
		unit.pOwner = 2;
		unit.setPosition(11, 11);
		unit.setMoves();
		unit.setAttacks();
		unitArray[unitIndex] = unit;
		unitIndex++;
		oonit = { color: SFE.RED, pos: [19, 18] };
		board[19][18] = unit;
		boardController.addUnit(unit);

		unit = new Unit("warrior");
		unit.pOwner = 2;
		unit.setPosition(11, 12);
		unit.setMoves();
		unit.setAttacks();
		unitArray[unitIndex] = unit;
		unitIndex++;
		oonit = { color: SFE.RED, pos: [19, 17] };
		board[19][17] = unit;
		boardController.addUnit(unit);
	}

	initBoardArray();
	init();
};
