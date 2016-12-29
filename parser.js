var request = require('request');
var cheerio = require('cheerio');

var htmlFile = "";

htmlFile+="<html>";
htmlFile+="<head>";
htmlFile+="<style>";
htmlFile+="div{margin: 0 auto; width: 50%; background-color:white; padding:20px; box-shadow:1px 1px 2px grey;}";
htmlFile+="html{background-color:#f4f4f4}";
htmlFile+="h1{text-align:center}";
htmlFile+="</style>";
htmlFile+="</head>";




var date = 2013; // beginning date (works only from 2013 and above)
var dateMax = 2016; // ending date

function recup(date){
	request('https://fr.wikipedia.org/wiki/'+date+'_au_cin%C3%A9ma', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var content = cheerio.load(html);
    var films = [];
  	htmlFile+="<div><h1> ========== FILMS DE "+date+" ========== </h1>";
    content('.NavFrame').each(function(i, table) {
    	table=cheerio.load(table);
	  table('table').each(function(t, elem) {
	  	elem = cheerio.load(elem);
	    elem('tr').each(function(j,tr){
	    		tr = cheerio.load(tr);
	    		tr('td').each(function(l,td){
	    			if(l<=1){
	    				td = cheerio.load(td);
	    				if(td.text().replace(/\s/g, '') && l==1){
	    					films.push(":");
	    					films.push(td.text());
	    				}
		    			else if(td.text().replace(/\s/g, '')){
		    				films.push(td.text());
		    			}
	    			}
	    			
		    		
	    		});
	    });
	  });
	});
	for(var i = 0; i<films.length; i++){
		if(films[i+1] == ":"){
			htmlFile+="</ul><h3>"+films[i].toUpperCase()+" "+date+"</h3><ul>";
		}else if(films[i] != ":"){
			htmlFile+="<li>"+films[i]+"</li>";
		}
	}
  }
  htmlFile+='</div>';

	if(date<dateMax){
		date++;
		recup(date);
	}
	else{
		save(htmlFile);
	}
});

}

recup(date);

function save(file){
	var fs = require('fs');
	fs.writeFile("movies.html", file, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	}); 
}