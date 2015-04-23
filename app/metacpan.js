var metacpan = {}
metacpan.recent = function(count, callback) {
	metacpan.get('http://api.metacpan.org/v0/release/_search?q=status:latest&fields=distribution,name,status,date,abstract&sort=date:desc&size=' + count, count, callback);
};

metacpan.release = function(query, callback) {
	metacpan.get("http://api.metacpan.org/v0/release/" + query, query, callback);
};
metacpan.author = function(query, callback) {
	metacpan.get("http://api.metacpan.org/v0/author/" + query, query, callback);
};


metacpan.get = function(url, query, callback) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			console.log('responseText:' + xmlhttp.responseText);
			var data = JSON.parse(xmlhttp.responseText);
			callback(query, data);
		}
	}

	xmlhttp.open("GET", url, true);
	//setTimeout(function() {  xmlhttp.abort()  },40000);
	xmlhttp.send();
};

Handlebars.registerHelper('iff', function(a, operator, b, opts) {
    var bool = false;
    switch(operator) {
       case '==':
           bool = a == b;
           break;
       case '!=':
           bool = a != b;
           break;
       case '>':
           bool = a > b;
           break;
       case '<':
           bool = a < b;
           break;
       default:
           throw "Unknown operator " + operator;
    }
 
    if (bool) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});


function search() {
	var query = document.getElementById('query').value;
	metacpan.release(query, display_result);
}


function display(query, result, template) {
	var source   = document.getElementById(template).innerHTML;
	var template = Handlebars.compile(source);
	//var context = {name: result["name"]};
	//var html    = template(context);
	var html    = template(result);
	document.getElementById('result').innerHTML = html;

	var as = document.getElementsByClassName('release');
	for (i=0; i<as.length; i++) {
		as[i].addEventListener('click', function() {
			//var query = this.innerHTML;
			var query = this.getAttribute('data-distribution');
			//console.log(query);
			metacpan.release(query, display_result);
		});
	}

	var authors = document.getElementsByClassName('author');
	for (i = 0; i < authors.length; i++) {
		authors[i].addEventListener('click', function() {
			var query = this.getAttribute('data-author');
			metacpan.author(query, display_author);
		});
	}

}

function display_author(query, result) {
	if (result["profile"]) {
		for (i=0; i<result["profile"].length; i++) {
			if (result["profile"][i]["name"] == 'github') {
				result["profile"][i]["url"] = 'https://github.com/' + result["profile"][i]["id"];
			}
		}
	}

	display(query, result, 'author-template');
};

function display_result(query, result) {
	display(query, result, 'release-template');
};

function display_recent(count, result) {
	display(count, result, 'recent-template');
}
function display_home() {
	display('', '', 'home-template');
}

//document.getElementById('query').addEventListener('keyup', search);
document.getElementById('search').addEventListener('click', search);

document.getElementById('recent').addEventListener('click', function() {
	metacpan.recent(20, display_recent);
	return false;
});

document.getElementById('home').addEventListener('click', function() {
	display_home(); 
});

display_home();
