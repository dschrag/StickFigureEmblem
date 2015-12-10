/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var Cloudant = require('cloudant');
var me = '64a24f2c-69f0-40f4-bd9c-04d6488fbaba-bluemix'; // Set this to your own account
var password = 'cc6abd119705601eb695f5270baeaf5a01d00ed1c7179b44e65df40d9af95dfb';

// Initialize the library with my account.
var cloudant = Cloudant({account:me, password:password});

cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});

var dbsfe = cloudant.use('sfe_scores');

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

app.get('/hiscores', function(request, response) {
  function sendDetails(details) {
		response.send(details); 
  }
  
 var query = {
  "selector": {
    "score": {
      "$gt": 0
    }
  },
  "fields": [
    "name",
    "score"
  ],
  "limit": 10,
  "sort": [
    {
      "score": "desc"
    }
  ]
};

  var docs = dbsfe.find(query, function(err, response) {
	 var details = "";
	 /*console.log("=============")
	 console.log(response);
	 console.log("=============")
*/

	var data = response.docs;
	//console.log(data);
	numrows = data.length;
	//console.log(numrows);
	 
	 function catcatDetails(details, name, score) {
		var tblrowopen = "<tr>";
		var tbltagopen = '<td class="score">';
		var tbltagclose = "</td>";
		var tblrowclose = "</tr>";
		
		details = details.concat(tblrowopen);
		details = details.concat(tbltagopen);
		details = details.concat(name);
		details = details.concat(tbltagclose);
		details = details.concat(tbltagopen);
		details = details.concat(score);
		details = details.concat(tbltagclose);
		details = details.concat(tblrowclose);
		
		return details; 
	 }
	 
	 j = 0;
	 for (var i = 0; i < numrows; i++) {
		//console.log(i);
		  j++;
		  
		
		  var n = JSON.stringify(data[i].name);
		  var s = JSON.stringify(data[i].score);
		  //console.log("name " + n + " score " + s);
		  details = catcatDetails(details, n, s);
		  //console.log("details: " + details);
		  if (j == numrows) {
			//  console.log(details);
			  sendDetails(details);
		  }
	 }
	 
  });
  
});

app.get('/save_score', function(request, response) {
  var name = request.query.name;
  var score = request.query.score;

  var scoreRecord = { 'name': name, 'score' : parseInt(score), 'date': new Date() };
  dbsfe.insert(scoreRecord, function(err, body, header) {
    if (!err) {       
      response.send('Successfully added one score to the DB');
    }
  });
});

