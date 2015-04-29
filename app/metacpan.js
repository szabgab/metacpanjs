var metacpan = {}
metacpan.recent = function(count, callback, error) {
	metacpan.get('http://api.metacpan.org/v0/release/_search?q=status:latest&fields=distribution,name,status,date,abstract&sort=date:desc&size=' + count, count, callback, error);
};

metacpan.release = function(query, callback, error) {
	metacpan.get("http://api.metacpan.org/v0/release/" + query, query, callback, error);
};
metacpan.author = function(query, callback, error) {
	metacpan.get("http://api.metacpan.org/v0/author/" + query, query, callback, error);
};


metacpan.get = function(url, query, callback, error) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			switch (xmlhttp.status) {
				case 200:
					console.log('responseText:' + xmlhttp.responseText);
					var data = JSON.parse(xmlhttp.responseText);
					callback(query, data);
					break;
				case 404:
					console.log('Status: ' + xmlhttp.status);
					error(query, {code : 404});
					break;
				default:
					console.log('Status: ' + xmlhttp.status);
					error(query, data);
					break;
			}
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
	metacpan.release(query, display_result, show_error);
}

function click() {
	console.log('click');
	var id = this.getAttribute('id');
	var class_name = this.getAttribute('class');
	console.log(id);
	console.log(class_name);
	switch(id) {
		case('search'):
			search(); 
			return;
		case('home'):
			display_home(); 
			return;
		case('recent'):
			metacpan.recent(20, display_recent, show_error);
			return;
		default:
			console.log('id: ' + id);
	}

	switch(class_name) {
		case('release'):
			var query = this.getAttribute('data-distribution');
			//console.log(query);
			metacpan.release(query, display_result, show_error);
			break;
		case('author'):
			var query = this.getAttribute('data-author');
			metacpan.author(query, display_author, show_error);
			break;
		default:
			console.log('Unhandled class: ' + class_name);
	}
}

function show_error(query, result) {
	display(query, result, 'error-template');
}


function display(query, result, template) {
	var source   = document.getElementById(template).innerHTML;
	var template = Handlebars.compile(source);
	//var context = {name: result["name"]};
	//var html    = template(context);
	var html    = template(result);
	document.getElementById('result').innerHTML = html;

	var as = document.getElementsByTagName('a');
	for (i=0; i<as.length; i++) {
		as[i].addEventListener('click', click);
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

display_home();
