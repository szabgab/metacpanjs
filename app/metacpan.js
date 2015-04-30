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
metacpan.leaderboard = function(callback, error) {
	metacpan.post("http://api.metacpan.org/v0/release/_search", {
    "query": {
        "match_all": {}
    },
    "facets": {
        "author": {
            "terms": {
                "field": "author",
                "size": 100
            }
        }
    },
    "size": 0
   }, callback, error)
};

metacpan.post = function(url, data, callback, error) {
	xmlhttp = metacpan.prepare('', callback, error);
	xmlhttp.open("POST", url, true);
	//setTimeout(function() {  xmlhttp.abort()  },40000);
	//xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(JSON.stringify(data));
};


metacpan.get = function(url, query, callback, error) {
	xmlhttp = metacpan.prepare(query, callback, error);

	xmlhttp.open("GET", url, true);
	//setTimeout(function() {  xmlhttp.abort()  },40000);
	xmlhttp.send();
};

metacpan.prepare = function(query, callback, error) {
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
	return xmlhttp;
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
	console.log('id: ' + id);
	console.log('class: ' + class_name);
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
		case('leaderboard'):
			metacpan.leaderboard(display_leaderboard, show_error);
			return;
		default:
			console.log('unhandled id: ' + id);
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
	var data = {
		'github'            : 'https://github.com/',
		'twitter'           : 'https://twitter.com/',
		'coderwall'         : 'http://www.coderwall.com/',
		'delicious'         : 'http://www.delicious.com/',
		'facebook'          : 'http://www.facebook.com/',
		'github-meets-cpan' : 'http://gh.metacpan.org/user/',
		'gittip'            : 'https://gratipay.com/',
		'googleplus'        : 'https://plus.google.com/',
		'hackernews'        : 'https://news.ycombinator.com/user?id=',
		'linkedin'          : 'https://www.linkedin.com/in/',
		//'irc'               : '',
		'perlmonks'         : 'http://www.perlmonks.org/?node=',
		'stackoverflow'     : 'http://stackoverflow.com/users/',
		'vimeo'             : 'https://vimeo.com/',
		'xing'              : 'https://www.xing.com/profile/',
		'youtube'           : 'https://www.youtube.com/user/',
		'gitorious'         : 'https://gitorious.org/~',
		'ohloh'             : 'https://www.openhub.net/accounts/',
		'openhub'           : 'https://www.openhub.net/accounts/'
	};

	if (result["profile"]) {
		for (i=0; i<result["profile"].length; i++) {
			if (data[ result["profile"][i]["name"] ]) {
				result["profile"][i]["url"] =  data[ result["profile"][i]["name"] ] + result["profile"][i]["id"];
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
function display_leaderboard(count, result) {
	display(count, result, 'leaderboard-template');
}

function display_home() {
	display('', '', 'home-template');
}

$(document).ready(function() {
	//document.getElementById('query').addEventListener('keyup', search);
	document.getElementById('search').addEventListener('click', search);
	display_home();
});

