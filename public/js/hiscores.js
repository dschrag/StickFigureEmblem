// JavaScript Document
/**
 * Hiscores
 */

function createTableRow(name, score, date) {
  var dateObj = new Date(date);
  var formattedDate = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
  return '<tr> <td>' + score + '</td><td>' + name + '</td><td>' + formattedDate + '</td></tr>';
}

/**
 * Populate the hiscore table by retrieving top 10 scores from the DB. 
 * Called when the DOM is fully loaded.
 */
function populateTable() {
	console.log("running script...");	
  var table = $("#hiscore_table tr");
  $.get("/hiscores", function (data) {
    var hiscores = JSON.parse(data);
    hiscores.forEach(function (hiscore) {
      var html = createTableRow(hiscore.name, hiscore.score, hiscore.date);
      table.last().after(html);		
    });
  });	
}

$(populateTable);