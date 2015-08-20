"use strict";
/*global localStorage: false, jQuery: false, window: false, console: false, $: false, Handlebars: false */
/*jshint -W069 */
var metacpan = {

	'profiles' : {
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
	},

	'size' : function () {
		var page_size = parseInt(localStorage.getItem('page_size'), 10);
		if (page_size === null || page_size === 'null') {
			page_size = 10;
		}
		return page_size;
	},

	'page' : 1,

	'total' : 0,

	'cases' : {
		'bugtracker-github' : {
			'title'  : 'GitHub as bugtracker',
			'filter' : {
				'or' : [
					{ 'prefix' : { 'resources.bugtracker.web' : 'https://github' } },
					{ 'prefix' : { 'resources.bugtracker.web' : 'http://github' } },
				],
			},
		},
		'bugtracker-rt' : {
			'title'  : 'RT.CPAN as bugtracker',
			'filter' : {
				'or' : [
					{ 'prefix' : { 'resources.bugtracker.web' : 'https://rt.cpan.org' } },
					{ 'prefix' : { 'resources.bugtracker.web' : 'http://rt.cpan.org' } },
				],
			},
		},
		'bugtracker-sourceforge' : {
			'title'  : 'Sourceforge as bugtracker',
			'filter' : {
				'or' : [
					{ 'prefix' : { 'resources.bugtracker.web' : 'https://sourceforge.net' } },
					{ 'prefix' : { 'resources.bugtracker.web' : 'http://sourceforge.net' } },
				],
			},
		},
		'bugtracker-other' : {
			'title'  : 'Bugtracker is not rt.cpan, not GitHub, and not Sourceforge',
			'filter' : {
				'and' : [
					{ 'term': { 'status' : 'latest' } },
					{ 'exists' : { 'field' : 'resources.bugtracker.web' } },
					{ 'not' : { 'prefix' : { 'resources.bugtracker.web' : 'https://rt.cpan.org' } } },
					{ 'not' : { 'prefix' : { 'resources.bugtracker.web' : 'http://rt.cpan.org' } } },
					{ 'not' : { 'prefix' : { 'resources.bugtracker.web' : 'https://github' } } },
					{ 'not' : { 'prefix' : { 'resources.bugtracker.web' : 'http://github' } } },
					{ 'not' : { 'prefix' : { 'resources.bugtracker.web' : 'https://sourceforge.net' } } },
					{ 'not' : { 'prefix' : { 'resources.bugtracker.web' : 'http://sourceforge.net' } } },
				],
			},
		},


		//'homepage-eumm' : {
		//	'title'  : 'With "homepage" in META files created by EUMM',
		//	'filter' : {
		//		"and" : [
		//			{ "exists" : { "field" : "resources.homepage" } },
		//			//{ "prefix" : { "abstract" : "Semantic" } },
		//			//{ "prefix" : { "metadata.generated_by" : "Dist" } },
		//		],
		//	},
		//},
					//{ "regexp" : { "metadata.generated_by" : "Module::Install" } },
// ^Module::Install version ..., CPAN::Meta::Converter version ..."
// ^CPAN::Meta::Converter version ..."
// ^ExtUtils::MakeMaker version ..., CPAN::Meta::Converter version ..., CPAN::Meta::Converter version ...."
// Dist::Zilla

		'with-homepage' : {
			'title'  : 'With "homepage" in META files',
			'filter' : { "exists" : { "field" : "resources.homepage" } },
		},
		'no-repository' : {
			'title' : 'Recent releases without a repository in the META files',
			'filter' : {
				"and" : [
					{ "missing" : { "field" : "resources.repository.type" } },
					{ "missing" : { "field" : "resources.repository.url" } },
					{ "missing" : { "field" : "resources.repository.web" } },
				]
			},
		},
		'no-license' : {
			'title' : 'Recent releases without a "license" field in the META files',
			'filter' : { "term": { "license" : "unknown" } },
		},
	},

	'recent' : function (count) {
		return {
			url: 'http://api.metacpan.org/v0/release/_search', 
			method: 'post',
			data: {
				"query": {
					"match_all": {}
				},
				"fields" : [ "distribution", "name", "status", "date", "abstract" ],
				"sort" : [
					{ "date": {"order" : "desc"} }
				],
				"size" :  count
			}
		};
	},

	'releases' : function (title, filter, callback) {
		//var page_size = metacpan.size();
		//var page = metacpan.page;
		//var from = ( page - 1 ) * page_size;
		metacpan.post("http://api.metacpan.org/v0/release/_search", {
			"query": {
				"match_all": {}
			},
			"fields" : [ "metadata.resources.repository", "metadata.distribution", "date", "author", "distribution", "name", "metadata.name", "abstract" ],
			"filter" : filter,
			"sort" : [
				{ "date": {"order" : "desc"} }
			],
			"size" : 1000,
			//"size" : metacpan.size(),
			//"from" : from
		}, title, callback, metacpan.show_error);
	},


	'leaderboard' : function (query, callback) {
		var page_size = metacpan.size(),
			page = metacpan.page,
			from = (page - 1) * page_size;
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
		}, query, callback, metacpan.show_error);
	},
	'profile' : function (query, callback) {
		var page_size = metacpan.size(),
			page = metacpan.page,
			from = (page - 1) * page_size;
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
		}, query, callback, metacpan.show_error);
	},

	'ajax' : function(request, a, b) {
		if (request["method"] === "post") {
			metacpan.post(request["url"], request["data"], a, b, metacpan.show_error);
		}
	},

	'post' : function (url, data, query, callback, error) {
		return jQuery.post(url, JSON.stringify(data), function (result) {
			callback(query, result);
		}).fail(function (result) {
			error(query, result);
		});
	},

	'search' : function () {
		var query = $('#query').val();
		window.location.hash = '#search/' + query;
		metacpan.click(window.location.hash);
	},
	'filename_show' : function () {
		var query = $('#filename').val();
		window.location.hash = '#lab/files/' + query;
		metacpan.click(window.location.hash);
	},

	'show_error' : function (query, result) {
		metacpan.display(query, result, 'error-template');
	},

	'display' : function (query, result, template) {
		var html = metacpan.process_template(query, result, template);
		$('#result').html(html);
	},
	'process_template' : function (query, result, template) {
		if (result["hits"]) {
			metacpan.total = result["hits"]["total"];
		}

		var source   = $('#' + template).html();
		var template = Handlebars.compile(source);
		return template({'query' : query, 'result' : result});
	},

	'display_profile' : function (name, result) {
		for (var i=0; i < result["hits"]["hits"].length; i++) {
			var profile = result["hits"]["hits"][i]["fields"]["profile"];
			var url = "";
			var id = "";
			for (var j=0; j < profile.length; j++) {
				if (profile[j]["name"] == name) {
					id  = profile[j]["id"];
					url = metacpan.profiles[name] + profile[j]["id"];
					break;
				}
			}
			result["hits"]["hits"][i]["url"] = url;
			result["hits"]["hits"][i]["id"] = id;
		}

		metacpan.display(name, result, 'profile-template');
	},
	'parse_changes' : function (raw) {
		var changes = '';

		var lines = raw.split("\n");
		for (var i=0; i < lines.length; i++) {
			// 1.001014     Tue Dec 28 08:31:00:00 PST 2015
			//    * Write a test to ensure this changes file gets updated
			//    * Update changes file for 1.001013
			//    * Fix #399, conflict with strawberry-portable
			//    * restore ability to use regex with test_err and test_out
			//      (Zefram) [rt.cpan.org #89655] [github #389] [github #387]
			// 0.98_03 Thu Jun 21 13:04:19 PDT 2012
			var m = new RegExp(/^(\d+\.[\d_]+)\s+(.*?)\s*$/).exec(lines[i]);
			if (m) {
				changes += '<div class="version">' + lines[i] + '</div>';
			} else {
				var line = '&nbsp&nbsp&nbsp&nbsp'  + lines[i];
				line = line.replace(/\[(rt.cpan.org\s+#?(\d+))\]/, '[<a href="https://rt.cpan.org/Ticket/Display.html?id=$2">$1</a>]' );
				changes += '<div>' + line + '</div>';
			}
		}
		metacpan.changes = changes;
	},

	'click' : function (route) {
		var params = new Object;
		if (! route) {
			route = '';
		}
		route = route.replace(/^#/, '');
		if (/^https?:\/\//.exec(window.location)) {
			jQuery.get('/log/' + route);
		}
		var query_string = route.replace(/^[^?]*\?/, '');
		query_string.split(/\&/).forEach(function (pair) {
			var kv = pair.split(/=/);
			params[ kv[0] ] = kv[1];
		});
		route = route.replace(/\?.*/, '');

		route = route.split("/");

		$(".active").removeClass('active');
		var locator = route[0] === '' ? 'a[href=#]' : "a[href=#" + route[0] +"]" ;
		$(locator).parent('li').addClass('active');

		if (params["size"]) {
			localStorage.setItem('page_size', params["size"]);
		}
		if (params["page"]) {
			metacpan.page = parseInt(params["page"], 10);
		}

		switch(route[0]) {
			case('changes'):
				// invalid requests; TODO report error?
				if (route[1] != 'distribution' || ! route[2]) {
					window.location.hash = '#';
					break;
				}
				var release_name = route[2];
				jQuery.get('http://api.metacpan.org/v0/changes/' + release_name, function (result) {
					metacpan.parse_changes(result["content"]);
					//console.log(metacpan.changes);
					result["html"] = metacpan.changes;
					metacpan.display(release_name, result, 'changes-template');
				}).fail(metacpan.show_error);
				break;

			case('search'):
				// empty search redirct to home page
				if (route[1] === '') {
					window.location.hash = '#';
					break;
				}

				var term = route[1];
				var terms = term.split(/\s+/);
				//console.log(terms);
				// if users searches for Module/Name.pm   we should load it directly
				// if user search for Module::Name we try to load that exact module (we should search among the module names)
				// look at https://github.com/CPAN-API/metacpan-web/blob/master/lib/MetaCPAN/Web/Model/API/Module.pm
				// to see how MetaCPAN searches
				var a1 = jQuery.post('http://api.metacpan.org/v0/release/_search', JSON.stringify({
					"query": {
						"match_all": {}
					},
					"fields" : [ "distribution", "name", "status", "date", "abstract" ],
					//abstract
					//distribution
					//metadata.keywords
					//author
					"filter" : {
						"and" : [
							{ "or" : [
								{ "term": { "distribution" : term } },  // exact distribution name
								{ "term": { "provides" : term } },      // exact module name
							]},
							{ "term": { "status" : "latest" } },
						]
					},
					"sort" : [
						{ "date": {"order" : "desc"} }
					],
					"size" :  count
				}));
				$.when(a1).done(function (r1) {
					metacpan.display(route[1], r1, 'search-template');
					//console.log(r1);
				}).fail(metacpan.show_error);
				break;
			case(''):
				metacpan.display('', { 'recommended' : metacpan.recommended }, 'home-template');
				break;
			case('recent'):
				metacpan.ajax(metacpan.recent(20), count, function (count, result) {
					//console.log(result);
					var releases = metacpan.process_template(count, result["hits"]["hits"], 'releases-template');
					metacpan.display(count, releases, 'recent-template');
				});
				break;
			case('leaderboard'):
				metacpan.leaderboard('', function (count, result) {
					metacpan.display(count, result, 'leaderboard-template');
				});
				break;
			case('profiles'):
				metacpan.display(0, {'profiles' : metacpan.profiles }, 'profiles-template');
				break;

			case('other'):
				window.location.hash = '#lab';
				return;
			case('no-license'):
				window.location.hash = '#lab/no-license';
				return;
			case('lab'):
				var query = route[1];
				if (query === undefined) {
					metacpan.display(0, metacpan.cases, 'lab-template');
					break;
				}
				switch(query) {
					case('list'):
						var pages = metacpan.get_pages();
						metacpan.display('', pages, 'list-pages-template');
						break;
					case('files'):
						var filename = route[2];
						if (filename === undefined) {
							metacpan.display('', [], 'files-template');
							$('#filename-show').click(metacpan.filename_show);
							break;
						}
						filename = filename.trim();

						metacpan.post("http://api.metacpan.org/v0/file/_search", {
							"query": {
								"match_all": {}
							},
							"fields" : [ "author", "date", "distribution", "name", "path", "release" ],
							"filter" : {
								"and" : [
									{ "term" : { "status" : "latest" } },
									{ "term" : { "name" : filename } },
								],
							},
							//"sort" : [
							//	{ "date": {"order" : "desc"} }
							//],
							"size" : 100,
						}, '', function (count, result) {
							metacpan.display(filename, result["hits"]["hits"], 'files-template');
							$('#filename-show').click(metacpan.filename_show);
						}, metacpan.show_error);
						break;
					default:
						if (metacpan.cases[query]) {
							metacpan.releases(metacpan.cases[query]['title'], metacpan.cases[query]['filter'], function (count, result) {
								console.log(result);
								var releases = metacpan.process_template(count, result["hits"]["hits"], 'releases-template');
								metacpan.display(count, releases, 'some-template');
							});
						}
						break;
				}
				break;
			case('release'):
				var release_name = route[1];
				jQuery.get("http://api.metacpan.org/v0/release/" + release_name, function (result) {
					//console.log(result);

					// Link to version control
					// url only linking to http://github.com/szabgab/perl6-in-perl5/  (Inline-Rakudo)
					if (result["url"] && ! result["web"] && ! result["type"]) {
						if (new RegExp('https?://github.com/[^/]+/[^/]+/?$').exec(result["url"])) {
							result["web"] = result["url"];
							result["type"] = 'git';
							result["url"] += '.git';
						}
					}
					// type: git web https://github.com/PerlDancer/Dancer2   url: https://github.com/PerlDancer/Dancer2.git
					// url only http://svn.perlide.org/padre/trunk/Padre/ ????

					// CPANTS - Kwalitee
					// Access-Control-Allow-Origin is not set, if it gets set we can use this
					//jQuery.get('http://cpants.cpanauthors.org/dist/' + release_name + '.json', function (kwalitee) {
					//    console.log(kwalitee);
					//});


					jQuery.get("http://api.metacpan.org/v0/author/" + result["author"], function (author) {
						//console.log(author);
						$("#author").html(author["name"]);
					});

					metacpan.display(release_name, result, 'release-template');
				}).fail(metacpan.show_error);
				break;
			case('author'):
				var query = route[1];
				metacpan.query = query;
				var count = 200;

				var a1 = jQuery.get("http://api.metacpan.org/v0/author/" + query);
				var a2 = jQuery.post('http://api.metacpan.org/v0/release/_search', JSON.stringify({
					"query": {
						"match_all": {}
					},
					"fields" : [ "distribution", "name", "status", "date", "abstract" ],
					"filter" : {
						"term": { "author" : query }
					},
					"sort" : [
						{ "date": {"order" : "desc"} }
					],
					"size" :  count
				}));
				$.when(a1, a2).done(function (r1, r2) {
					var author = r1[0];
					var result = r2[0];
					if (author["profile"]) {
						author["profile"] = author["profile"].filter( function (p) { return metacpan.profiles[ p["name"] ]; });
						author["profile"].forEach( function (p) { p["url"] =  metacpan.profiles[ p["name"] ] + p["id"]; } );
					}
					var releases = metacpan.process_template(count, result["hits"]["hits"], 'releases-template');
					metacpan.display(metacpan.query, { 'releases' : releases, 'author' : author }, 'author-template');
				}).fail(metacpan.show_error);

				break;
			case('profile'):
				metacpan.profile(route[1], metacpan.display_profile);
				break;
			case('recommended'):
				var name = route[1];
				metacpan.display(name, { 'recommended' : metacpan.recommended[name] }, 'recommended-template');
				break;
			case('module'):
				window.location.hash = '#pod/' + route[1];
				break;
			case('pod'):
				var module_name = route[1];
				jQuery.get("http://api.metacpan.org/v0/pod/" + module_name, function (result) {
					metacpan.display(module_name, { pod: result, module: module_name }, 'pod-template');

					jQuery.get("http://api.metacpan.org/v0/module/" + module_name, function (result) {
						console.log(result);
						var breadcrumbs = '<a href="#release/' + result["distribution"] + '">' + result["distribution"] + '</a> ' + module_name + ' ';
						breadcrumbs += result["version"] + ' by <a href="#author/' + result["author"] + '">' + result["author"] + '</a>';
						$("#breadcrumbs").html(breadcrumbs);
						$("#abstract").html(result["abstract"]);
						if (!result["authorized"]) {
							$('#unauthorized').show();
						}
					}); //.fail(metacpan.show_error);
				});
				window.scrollTo(0, 0);
				break;
			default:
				console.log('unhandled route: ' + route);
		}
		$("#save").attr('href', window.location.hash);
	},

	'get_pages' : function () {
		var str = localStorage.getItem('saved_pages');
		if (str === null) {
			var o = new Object;
			o["default"] = new Object;
			return o;
		}
		return JSON.parse(str);
	},

};


Handlebars.registerHelper('pager', function () {
	var page_count = Math.ceil(metacpan.total / metacpan.size());
	var page = metacpan.page;
	var path = window.location.hash;
	if (path) {
		path = path.replace(/\?.*/, '');
	}

	var html = 'Page:';
	html += '<ul>';
	for (var n = Math.max(1, page - 2) ; n <= Math.min(page + 2, page_count); n++) {
		html += '<li>';
		if (page == n) {
			html += '<b>';
		}
		html += '<a href="' + path + '?page=' + n + '">' + n + '</a>';
		if (page == n) {
			html += '</b>';
		}
		html += '</li>';
	}

	html += '</ul>';
	return new Handlebars.SafeString(html);
});

Handlebars.registerHelper('sizer', function () {
	var page_size = metacpan.size();
	var path = window.location.hash;
	if (path) {
		path = path.replace(/\?.*/, '');
	}

	var html = 'Size:';
	html += '<ul>';
	[1, 10, 50, 100, 500].forEach(function (n) {
		html += '<li>';
		if (page_size == n) {
			html += '<b>';
		}
		html += '<a href="' + path + '?size=' + n + '">' + n + '</a>';
		if (page_size == n) {
			html += '</b>';
		}
		html += '</li>';
	});
	html += '</ul>';
	return new Handlebars.SafeString(html);
});


Handlebars.registerHelper('iff', function (a, operator, b, opts) {
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

$().ready(function () {
	$('#search').click(metacpan.search);
	$(window).bind('hashchange', function () {
		metacpan.click(window.location.hash);
	});
	$('#save').bind('click', function (e) {
		var page = window.location.hash;
		var pages = metacpan.get_pages();
		if (pages["default"][page]) {
			$("#msg").html('This page was already saved');
			$("#msg").removeClass();
			$("#msg").addClass("tools-message tools-message-red");
		} else {
			var m = new RegExp('^#(pod|release)/(.*)').exec(page);
			if (m) {
				var title = m[0];
				pages["default"][page] = {
					title: title,
					date:  new Date,
				};
				localStorage.setItem('saved_pages', JSON.stringify(pages));
				$("#msg").html('We have just saved this page');
				$("#msg").removeClass();
				$("#msg").addClass("tools-message tools-message-green");
			} else {
				$("#msg").html('You can only save pod and release pages.');
				$("#msg").removeClass();
				$("#msg").addClass("tools-message tools-message-red");
			}
		}
		$("#msg").message();
		return;
	});

	metacpan.click(window.location.hash);
});
