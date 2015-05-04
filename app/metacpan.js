var metacpan = {}
metacpan.history = [];
metacpan.size = function() {
	var page_size = parseInt(localStorage.getItem('page_size'));
	if (page_size == null || page_size == 'null') {
		page_size = 10;
	}
	return page_size;
};
metacpan.page = 1;
metacpan.total = 0;

metacpan.recent = function(count, callback, error) {
	metacpan.post('http://api.metacpan.org/v0/release/_search', {
		"query": {
			"match_all": {}
		},
		//"filter" : {
		//	"term": { "status" : "latest" }
		//},
		"fields" : [ "distribution", "name", "status", "date", "abstract" ],
		"sort" : [
			{ "date": {"order" : "desc"} }
		],
		"size" :  count
	}, count, callback, error);
};

metacpan.release = function(query, callback, error) {
	metacpan.get("http://api.metacpan.org/v0/release/" + query, query, callback, error);
};

metacpan.module = function(query, callback, error) {
	metacpan.get("http://api.metacpan.org/v0/module/" + query, query, callback, error);
};



metacpan.author = function(query, callback, error) {
	metacpan.get("http://api.metacpan.org/v0/author/" + query, query, callback, error);
};

metacpan.no_license = function(query, callback, error) {
	metacpan.history.push({ 'req' : metacpan.no_license, 'query' : query, 'callback' : callback, 'error' : error });
	//var page_size = metacpan.size();
	//var page = metacpan.page;
	//var from = ( page - 1 ) * page_size;
	metacpan.post("http://api.metacpan.org/v0/release/_search", {
		"query": {
			"match_all": {}
		},
		"fields" : [ "metadata.license", "metadata.distribution", "date", "author", "license", "distribution", "name", "metadata.name" ],
		"size" : 1000,
		//"size" : metacpan.size(),
		//"from" : from
	}, query, callback, error)

}

metacpan.leaderboard = function(query, callback, error) {
	metacpan.history.push({ 'req' : metacpan.leaderboard, 'query' : query, 'callback' : callback, 'error' : error });
	var page_size = metacpan.size();
	var page = metacpan.page;
	var from = ( page - 1 ) * page_size;
	metacpan.post("http://api.metacpan.org/v0/release/_search", {
		"query": {
			"match_all": {}
		},
		"facets": {
			"author": {
				"terms": {
					"field": "author",
					"from" : from,
					"size": page_size
				}
			}
		},
		"size": 0
	}, query, callback, error)
};

metacpan.profile = function(query, callback, error) {
	metacpan.history.push({ 'req' : metacpan.profile, 'query' : query, 'callback' : callback, 'error' : error });
	var page_size = metacpan.size();
	var page = metacpan.page;
	var from = ( page - 1 ) * page_size;
	metacpan.post("http://api.metacpan.org/v0/author/_search", {
		"query": {
			"match_all": {}
		},
		"filter" : {
			"term": { "author.profile.name" : query }
		},
		"fields" : ["name", "pauseid", "profile"],
		"size" : metacpan.size(),
		"from" : from
	}, query, callback, error);
};

metacpan.profiles = {
		'coderwall'         : 'http://www.coderwall.com/',
		'delicious'         : 'http://www.delicious.com/',
		'facebook'          : 'http://www.facebook.com/',
		'flickr'            : 'http://www.flickr.com/people/',
		'geeklist'          : 'http://geekli.st/',
		'github'            : 'https://github.com/',
		'github-meets-cpan' : 'http://gh.metacpan.org/user/',
		'gitorious'         : 'https://gitorious.org/~',
		'gittip'            : 'https://gratipay.com/',
		'googleplus'        : 'https://plus.google.com/',
		'hackernews'        : 'https://news.ycombinator.com/user?id=',
		'identica'          : 'http://identi.ca/',
		//'irc'               : '',
		'lastfm'            : 'http://www.last.fm/user/',
		'linkedin'          : 'https://www.linkedin.com/in/',
		'klout'             : 'http://klout.com/#/',
		'ohloh'             : 'https://www.openhub.net/accounts/',
		'openhub'           : 'https://www.openhub.net/accounts/',
		'perlmonks'         : 'http://www.perlmonks.org/?node=',
		//'perlresume'        : 'http://perlresume.org/',
		'reddit'            : 'http://www.reddit.com/user/',
		'stackoverflow'     : 'http://stackoverflow.com/users/',
		'twitter'           : 'https://twitter.com/',
		'vimeo'             : 'https://vimeo.com/',
		'xing'              : 'https://www.xing.com/profile/',
		'youtube'           : 'https://www.youtube.com/user/'
};


metacpan.post = function(url, data, query, callback, error) {
	xmlhttp = metacpan.prepare(query, callback, error);
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

Handlebars.registerHelper('pager', function() {
	var html = 'Page:';
	var page_count = Math.ceil(metacpan.total / metacpan.size());
	var page = metacpan.page;
	html += '<ul>';
	for (var n = Math.max(1, page - 2) ; n <= Math.min(page + 2, page_count); n++) {
		html += '<li>';
		if (page == n) {
			html += '<b>';
		}
		html += '<a href="#" class="page" data-page="' + n + '">' + n + '</a>';
		if (page == n) {
			html += '</b>';
		}
		html += '</li>';
	}

	html += '</ul>';
	return new Handlebars.SafeString(html);
});

Handlebars.registerHelper('sizer', function() {
	var html = 'Size:';
	html += '<ul>';
	var page_size = metacpan.size();
	[1, 10, 50, 100, 500].forEach(function(n) {
		html += '<li>';
		if (page_size == n) {
			html += '<b>';
		}
		html += '<a href="#" class="size" data-size="' + n + '">' + n + '</a>';
		if (page_size == n) {
			html += '</b>';
		}
		html += '</li>';
	});
	html += '</ul>';
	return new Handlebars.SafeString(html);
});


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
	var query = $('#query').val();
	metacpan.release(query, display_result, show_error);
}

function click() {
	var id = this.getAttribute('id');
	var class_name = this.getAttribute('class');
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
			metacpan.leaderboard('', display_leaderboard, show_error);
			return;
		case('profiles'):
			display(0, {'profiles' : metacpan.profiles }, 'profiles-template');
			return;
		case('other'):
			display(0, {}, 'other-template');
			return;
		case('no-license'):
			metacpan.no_license('', display_no_license, show_error);
			return;
		default:
			console.log('unhandled id: ' + id);
	}

	switch(class_name) {
		case('release'):
			var query = this.getAttribute('data-distribution');
			metacpan.release(query, display_result, show_error);
			break;
		case('author'):
			var query = this.getAttribute('data-author');
			metacpan.author(query, display_author, show_error);
			break;
		case('profile'):
			var profile = this.getAttribute('data-profile');
			metacpan.profile(profile, display_profile, show_error);
			break;
		case('size'):
			localStorage.setItem('page_size', this.getAttribute('data-size'));
			reload();
			return;
		case('page'):
			metacpan.page = parseInt(this.getAttribute('data-page'));
			reload();
			return;
		case('recommended'):
			var name = this.getAttribute('data-recommended');
			display(name, { 'recommended' : metacpan.recommended[name] }, 'recommended-template');
			return;
		case('module'):
			var query = this.getAttribute('data-module');
			metacpan.module(query, display_module, show_error);
			return;
		default:
			console.log('Unhandled class: ' + class_name);
	}
}

function reload() {
	if (metacpan.history.length > 0) {
		var last = metacpan.history.length - 1;
		metacpan.history[last]["req"]( metacpan.history[last]["query"], metacpan.history[last]["callback"], metacpan.history[last]["error"])
	}
}

function show_error(query, result) {
	display(query, result, 'error-template');
}


function display(query, result, template) {
	if (result["hits"]) {
		metacpan.total = result["hits"]["total"];
	}

	var source   = $('#' + template).html();
	var template = Handlebars.compile(source);
	//var context = {name: result["name"]};
	//var html    = template(context);
	var html    = template({'query' : query, 'result' : result});
	$('#result').html(html);

	$('a').click(click);
}

function display_profile(name, result) {
	for (var i=0; i < result["hits"]["hits"].length; i++) {
		var profile = result["hits"]["hits"][i]["fields"]["profile"];
		var url = "";
		for (var j=0; j < profile.length; j++) {
			if (profile[j]["name"] == name) {
				url = metacpan.profiles[name] + profile[j]["id"];
				break;
			}
		}
		result["hits"]["hits"][i]["url"] = url;
	}

	display(name, result, 'profile-template');
}

function display_author(query, result) {
	if (result["profile"]) {
		result["profile"] = result["profile"].filter( function(p) { return metacpan.profiles[ p["name"] ] });
		result["profile"].forEach( function(p) { p["url"] =  metacpan.profiles[ p["name"] ] + p["id"] } );
	}

	display(query, result, 'author-template');
};

function display_module(query, result) {
	display(query, result, 'module-template');
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

function display_no_license(count, result) {
	var distros = result["hits"]["hits"].filter(function(h) { return h["fields"]["license"] == "unknown" } );
	display(count, distros, 'releases-template');
}


function display_home() {
	display('', { 'recommended' : metacpan.recommended }, 'home-template');
}

$(document).ready(function() {
	$('#search').click(search);
	display_home();
});

