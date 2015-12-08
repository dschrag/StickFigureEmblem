// JavaScript Document
var SFE = {
    BLUE: 1,
    GREEN: 2
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
		var row, col, oonit;
		    var unit;
		    unit = new Unit("ranger");

		oonit = { color: SFE.BLUE, pos: [0, 0] };
		board[0][0] = oonit;
		boardController.addUnit(oonit);
		oonit = { color: SFE.BLUE, pos: [1, 0] };
		board[1][0] = oonit;
		boardController.addUnit(oonit);
		oonit = { color: SFE.BLUE, pos: [2, 0] };
		board[2][0] = oonit;
		boardController.addUnit(oonit);
		
		oonit = { color: SFE.GREEN, pos: [19, 19] };
		board[19][19] = oonit;
		boardController.addUnit(oonit);
		oonit = { color: SFE.GREEN, pos: [19, 18] };
		board[19][18] = oonit;
		boardController.addUnit(oonit);
		oonit = { color: SFE.GREEN, pos: [19, 17] };
		board[19][17] = oonit;
		boardController.addUnit(oonit);
		
	}
	
	initBoardArray();
	init();
};