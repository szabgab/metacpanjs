metacpan.recommended = {
	'async'           : {
		'title'       : 'Asynchronous code',
		'modules'     : [ 'POE', 'AnyEvent', 'AnyEvent::HTTP', 'IO::Async' ],
	},
    'cgi'             : {
		'title'       : 'CGI - (for new projects, better use one of the Modern Web development frameworks)',
		'modules'     : [ 'CGI', 'CGI::Simple', 'CGI::Session', 'CGI::Application' ],
	},
	'csv'             : {
		'title'       : 'CSV - Comma separated values',
		'modules'     : [ 'Text::CSV', 'Text::CSV_XS', 'Spreadsheet::Read' ],
	},
	'config'          : {
		'title'       : 'Configuration and INI files',
		'modules'     : [ 'Config::Tiny', 'Config::General', 'Config::Any' ],
	},
	'catalyst'        : {
		'title'       : 'Catalyst web MVC framework',
		'modules'     : [ 'Catalyst', 'Catalyst::Action::RenderView', 'Catalyst::Authentication::Store::Proxy', 'Catalyst::Authentication::User', 'Catalyst::Model', 'Catalyst::Plugin::Authentication', 'Catalyst::Plugin::ConfigLoader', 'Catalyst::Plugin::Static::Simple', 'Catalyst::TraitFor::Request::REST::ForBrowsers', 'Catalyst::View::JSON', 'Catalyst::View::TT::Alloy', 'CatalystX::RoleApplicator'],
	},
	'dancer'          : {
		'title'       : 'Dancer, light weight web development framework. (for new projects use Dancer2)',
		'modules'     :[ 'Dancer', 'Dancer::Plugin::DBIC', 'Dancer::Plugin::Auth::Extensible', 'Dancer::Plugin::Passphrase', 'Dancer::Plugin::Email', 'Dancer::Plugin::Lexicon', 'Dancer::Plugin::Auth::Extensible::Provider::Usergroup', 'Dancer::Plugin::Ajax', 'Dancer::Plugin::Database', 'Dancer::Plugin::EscapeHTML', 'Dancer::Session::Cookie', 'Dancer::Plugin::SimpleCRUD' ],
	},
	'dancer2'         : {
		'title'       : 'Dancer2',
		'modules'     : [ 'Dancer2::Plugin::Path::Class', 'Dancer2::Plugin::DBIC', 'Dancer2::Plugin::Ajax', 'Dancer2::Plugin::Passphrase', 'Dancer2::Plugin::Auth::Extensible', 'Dancer2::Plugin::Feed', 'Dancer2::Plugin::Emailesque', 'Dancer2::Template::Xslate', 'Dancer2::Plugin::UnicodeNormalize', 'Dancer2::Plugin::RootURIFor'],
	},
	'database'        : {
		'title'       : 'Database access',
		'modules'         : [ 'DBI', 'DBIx::Class', 'DBD::mysql', 'DBD::SQLite', 'MongoDB', 'DBD::Oracle', 'DBD::Sybase', 'DBD::Pg', 'DBD::ODBC', 'DBD::CSV', 'DBD::DB2' ],
	},
	'date-time'       : {
		'title'       : 'Date and Time',
		'modules'     : [ 'DateTime', 'DateTime::Tiny', 'DateTime::Format::Strptime', 'DateTime::TimeZone', 'DateTime::Duration', 'DateTime::Format::ISO8601', 'DateTime::Format::MySQL', 'DateTime::Format::DateParse' ],
	},
	'email'           : {
		'title'       : 'Sending e-mails',
		'modules'     : [ 'Email::Valid', 'Email::Stuffer', 'Email::Sender' ],
	},
	'excel'           : {
		'title'       : 'Excel and other Spreadsheet',
		'modules'     : [ 'Spreadsheet::Read', 'Spreadsheet::ParseExcel', 'Spreadsheet::WriteExcel', 'Spreadsheet::XLSX', 'Spreadsheet::ParseXLSX'  ],
	},
	'exception'       : {
		'title'       : 'Exception handling',
		'modules'     : [ 'TryCatch', 'Try::Tiny' ],
	},
	'json'            : {
		'title'       : 'JSON',
		'modules'     : [ 'JSON::MaybeXS', 'Mojo::JSON', 'JSON' ],
	},
	'logging'         : {
		'title'       : 'Logging',
		'modules'     : [ 'Log::Log4perl', 'Log::Dispatch' ],
	},
	'moo'             : {
		'title'       : 'Moo - Minimalist Object Orientation (with Moose compatibility)',
		'modules'     : [ 'Moo', 'MooX::late', 'MooX::Types::MooseLike', 'MooX::Types::CLike', 'MooX::Singleton', 'MooX::Options'],
	},
	'moose'           : {
		'title'       : 'Moose - the (post)modern Object Orientation of Perl',
		'modules'     : [ 'Moose', 'MooseX::ClassAttribute', 'MooseX::Role::Parameterized', 'MooseX::StrictConstructor', 'MooseX::Types::Common::Numeric', 'MooseX::Types::Common::String', 'MooseX::Types::Moose', 'MooseX::Types::URI'],
	},
	'oop'             : {
		'title'       : 'Object Oriented Programming in Perl',
		'modules'     : [ 'Moose', 'Moo' ],
	},
	'perl'            : {
		'title'       : 'Tools for the Perl developer',
		'modules'     : [ 'Devel::NYTProf', 'Modern::Perl', 'Perl::Critic', 'Perl::Tidy', 'Module::Version', 'App::cpanminus', 'App::cpanoutdated', 'App::perlbrew', 'App::FatPacker', 'Carton', 'Pinto', 'local::lib' ],
	},
	'psgi'            : {
		'title'       : 'PSGI',
		'modules'     : [ 'Plack', 'Plack::Middleware::Assets', 'Plack::Middleware::ReverseProxy', 'Plack::Middleware::Runtime', 'Plack::Middleware::Headers', 'Plack::Middleware::ServerStatus::Lite', 'Plack::Middleware::Session', 'Plack::Middleware::Session::Cookie'],
	},
	'templating'      : {
		'title'       : 'Templating systems',
		'modules'     : [ 'Template', 'Template::Alloy', 'Template::Plugin::DateTime', 'Template::Plugin::JSON', 'Template::Plugin::Markdown', 'Template::Plugin::MultiMarkdown', 'Template::Plugin::Number::Format', 'Template::Plugin::Page'],
	},
	'testing'         : {
		'title'       : 'Testing',
		'modules'     : [ 'Test::More', 'Test::Most', 'Devel::Cover', 'Test::Differences', 'Test::Code::TidyAll', 'Test::Mock::Simple', 'Test::MockTime', 'Test::Perl::Critic', 'Test::Version', 'Test::Warn', 'Test::WWW::Mechanize' ],
	},
	'xml'             : {
		'title'       : 'XML processing',
		'modules'     : [ 'XML::LibXML', 'XML::LibXSLT', 'XML::SAX', 'XML::Twig' ],
	},
	'web-crawling'    : {
		'title'       : 'Web crawling, screen scraping, web clients',
		'modules'     : [ 'WWW::Mechanize', 'LWP::UserAgent', 'LWP::Simple', 'WWW::Selenium', 'WWW::Mechanize::Firefox' ],
	},
	'web-development' : {
		'title'       : 'Modern Web development frameworks',
		'modules'     : [ 'Dancer2', 'Mojolicious', 'Plack', 'Catalyst'],
	},
	'web-server'      : {
		'title'       : 'Web servers',
		'modules'     : [ 'Starman', 'Twiggy', 'PSGI' ],
	},
};

