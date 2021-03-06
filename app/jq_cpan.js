"use strict";
/*global localStorage: false, jQuery: false, window: false, console: false, $: false, Handlebars: false */
/*jshint -W069 */

var api_url = 'https://fastapi.metacpan.org/v1/';

var api = {
	'module' : function(module_name) {
		return {
			method: 'get',
			url: api_url + 'module/' + module_name
		}
	},
	'pod' : function(module_name) {
		return {
			method: 'get',
			url: api_url + 'pod/' + module_name, 
		}
	},
	'changes' : function(release_name) {
		return {
			method: 'get',
			url: api_url + 'changes/' + release_name
		}
	},
	'author' : function(pauseid) {
		return {
			method: 'get',
			url: api_url + "author/" + pauseid,
		}
	},
	'author_post' : function(page_size, page, size, query) {
		var from = (page - 1) * page_size;
		return {
			method: 'post',
			url: api_url + 'author/_search',
			data: {
				"query": {
					"match_all": {}
				},
				"filter" : {
					"term": { "author.profile.name" : query }
				},
				"fields" : ["name", "pauseid", "profile"],
				"size" : size,
				"from" : from
			}, 
		};
	},
	'release' : function (release) {
		return {
			method: 'get',
			url: api_url + "release/" + release,
		};
	},
	'search' : function(term, count) {
		return {
			method: 'post',
			url: api_url + 'release/_search', 
			data: {
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
			}
		};
	},
	'files_post' : function (filename) {
		return {
			method: 'post',
			url: api_url + 'file/_search',
			data: {
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
			}
		};
	},
	'release_post' : function (pauseid, count) {
		return {
			method: 'post',
			url : api_url + 'release/_search',
			data: {
					"query": {
						"match_all": {}
					},
					"fields" : [ "distribution", "name", "status", "date", "abstract" ],
					"filter" : {
						"term": { "author" : pauseid }
					},
					"sort" : [
						{ "date": {"order" : "desc"} }
					],
					"size" :  count
				}
		}
	},
	'recent' : function (count) {
		return {
			method: 'post',
			url: api_url + 'release/_search', 
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

	'leaderboard' : function (page_size, page) {
		var from = (page - 1) * page_size;
		return {
			method: 'post',
			url: api_url + "release/_search",
			data: {
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
			}
		};
	},

};

var jq_cpan = {

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


	'releases' : function (title, filter, callback) {
		//var page_size = jq_cpan.size();
		//var page = jq_cpan.page;
		//var from = ( page - 1 ) * page_size;
		jq_cpan.post(api_url + "release/_search", {
			"query": {
				"match_all": {}
			},
			"fields" : [ "metadata.resources.repository", "metadata.distribution", "date", "author", "distribution", "name", "metadata.name", "abstract" ],
			"filter" : filter,
			"sort" : [
				{ "date": {"order" : "desc"} }
			],
			"size" : 1000,
			//"size" : jq_cpan.size(),
			//"from" : from
		}, title, callback, jq_cpan.show_error);
	},


	'ajax' : function(request, a, b) {
		//console.log('ajax', request);
		if (request["method"] === "post") {
			jq_cpan.post(request["url"], request["data"], a, b, jq_cpan.show_error);
			return;
		}
		if (request["method"] === "get") {
			//console.log('URL:', request['url']);
			jq_cpan.get(request["url"], a, b, jq_cpan.show_error);
			return;
		}
		console.error('Invalid method in request', request);
		return;
	},

	'get' : function (url, query, callback, error) {
		return jQuery.get(url, function (result) {
			callback(query, result);
		}).fail(function (result) {
			error(query, result);
		});
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
		jq_cpan.click(window.location.hash);
	},
	'filename_show' : function () {
		var query = $('#filename').val();
		window.location.hash = '#lab/files/' + query;
		jq_cpan.click(window.location.hash);
	},

	'show_error' : function (query, result) {
		jq_cpan.display(query, result, 'error-template');
	},

	'display' : function (query, result, template) {
		var html = jq_cpan.process_template(query, result, template);
		$('#result').html(html);
	},
	'process_template' : function (query, result, template) {
		if (result["hits"]) {
			jq_cpan.total = result["hits"]["total"];
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
					url = jq_cpan.profiles[name] + profile[j]["id"];
					break;
				}
			}
			result["hits"]["hits"][i]["url"] = url;
			result["hits"]["hits"][i]["id"] = id;
		}

		jq_cpan.display(name, result, 'profile-template');
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
		jq_cpan.changes = changes;
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
			jq_cpan.page = parseInt(params["page"], 10);
		}

		switch(route[0]) {
			case('changes'):
				// invalid requests; TODO report error?
				if (route[1] != 'distribution' || ! route[2]) {
					window.location.hash = '#';
					break;
				}
				var release_name = route[2];
				jq_cpan.ajax(api.changes(release_name), count, function (count, result) {
					jq_cpan.parse_changes(result["content"]);
					//console.log(jq_cpan.changes);
					result["html"] = jq_cpan.changes;
					jq_cpan.display(release_name, result, 'changes-template');
				});
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
				jq_cpan.ajax(api.search(term, count), 1, function (count, r1) {
					jq_cpan.display(route[1], r1, 'search-template');
					//console.log(r1);
				});
				break;
			case(''):
				jq_cpan.display('', { 'recommended' : jq_cpan.recommended }, 'home-template');
				break;
			case('recent'):
				jq_cpan.ajax(api.recent(20), count, function (count, result) {
					//console.log(result);
					var releases = jq_cpan.process_template(count, result["hits"]["hits"], 'releases-template');
					jq_cpan.display(count, releases, 'recent-template');
				});
				break;
			case('leaderboard'):
				jq_cpan.ajax(api.leaderboard(jq_cpan.size(), jq_cpan.page), query, function (count, result) {
					jq_cpan.display(count, result, 'leaderboard-template');
				});
				break;
			case('profiles'):
				jq_cpan.display(0, {'profiles' : jq_cpan.profiles }, 'profiles-template');
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
					jq_cpan.display(0, jq_cpan.cases, 'lab-template');
					break;
				}
				switch(query) {
					case('list'):
						var pages = jq_cpan.get_pages();
						jq_cpan.display('', pages, 'list-pages-template');
						break;
					case('files'):
						var filename = route[2];
						if (filename === undefined) {
							jq_cpan.display('', [], 'files-template');
							$('#filename-show').click(jq_cpan.filename_show);
							break;
						}
						filename = filename.trim();

						jq_cpan.ajax(api.files_post(filename), query, function (count, result) {
							jq_cpan.display(filename, result["hits"]["hits"], 'files-template');
							$('#filename-show').click(jq_cpan.filename_show);
						}, jq_cpan.show_error);
						break;
					default:
						if (jq_cpan.cases[query]) {
							jq_cpan.releases(jq_cpan.cases[query]['title'], jq_cpan.cases[query]['filter'], function (count, result) {
								console.log(result);
								var releases = jq_cpan.process_template(count, result["hits"]["hits"], 'releases-template');
								jq_cpan.display(count, releases, 'some-template');
							});
						}
						break;
				}
				break;
			case('release'):
				var release_name = route[1];
				//console.log('release');
				jq_cpan.ajax(api.release(release_name), 1, function (count, result) {
					//console.log('release result:', result);

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


					jq_cpan.ajax(api.author(result["author"]), 1, function (count, author) {
						//console.log(author);
						$("#author").html(author["name"]);
					});

					jq_cpan.display(release_name, result, 'release-template');
				});
				break;
			case('author'):
				var query = route[1];
				jq_cpan.query = query;
				var count = 200;

				var a1 = jQuery.get(api.author(query).url);
				var api2 = api.release_post(query, count);
				var a2 = jQuery.post(api2.url, JSON.stringify(api2.data));
				$.when(a1, a2).done(function (r1, r2) {
					var author = r1[0];
					var result = r2[0];
					if (author["profile"]) {
						author["profile"] = author["profile"].filter( function (p) { return jq_cpan.profiles[ p["name"] ]; });
						author["profile"].forEach( function (p) { p["url"] =  jq_cpan.profiles[ p["name"] ] + p["id"]; } );
					}
					var releases = jq_cpan.process_template(count, result["hits"]["hits"], 'releases-template');
					jq_cpan.display(jq_cpan.query, { 'releases' : releases, 'author' : author }, 'author-template');
				}).fail(jq_cpan.show_error);

				break;
			case('profile'):
				jq_cpan.ajax(api.author_post(jq_cpan.size(), jq_cpan.page, jq_cpan.size(), route[1]), route[1], jq_cpan.display_profile);
				break;
			case('recommended'):
				var name = route[1];
				jq_cpan.display(name, { 'recommended' : jq_cpan.recommended[name] }, 'recommended-template');
				break;
			case('module'):
				window.location.hash = '#pod/' + route[1];
				break;
			case('pod'):
				var module_name = route[1];
				jq_cpan.ajax(api.pod(module_name), 1, function (count, result) {
					jq_cpan.display(module_name, { pod: result, module: module_name }, 'pod-template');

					jq_cpan.ajax(api.module(module_name), 1, function (count, result) {
						console.log(result);
						var breadcrumbs = '<a href="#release/' + result["distribution"] + '">' + result["distribution"] + '</a> ' + module_name + ' ';
						breadcrumbs += result["version"] + ' by <a href="#author/' + result["author"] + '">' + result["author"] + '</a>';
						$("#breadcrumbs").html(breadcrumbs);
						$("#abstract").html(result["abstract"]);
						if (!result["authorized"]) {
							$('#unauthorized').show();
						}
					}); //.fail(jq_cpan.show_error);
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
	var page_count = Math.ceil(jq_cpan.total / jq_cpan.size());
	var page = jq_cpan.page;
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
	var page_size = jq_cpan.size();
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
	$('#search').click(jq_cpan.search);
	$(window).bind('hashchange', function () {
		jq_cpan.click(window.location.hash);
	});
	$('#save').bind('click', function (e) {
		var page = window.location.hash;
		var pages = jq_cpan.get_pages();
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

	jq_cpan.click(window.location.hash);
});
