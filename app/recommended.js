metacpan.recommended = {
	'async'           : [ 'POE', 'AnyEvent', 'IO::Async' ],
    'cgi'             : [ 'CGI', 'CGI::Simple' ],
	'csv'             : [ 'Text::CSV', 'Spreadsheet::Read' ],
	'config'          : [ 'Config::Tiny', 'Config::General', 'Config::Any' ],
	'Catalyst'        : [ 'Catalyst', 'Catalyst::Action::RenderView', 'Catalyst::Authentication::Store::Proxy', 'Catalyst::Authentication::User', 'Catalyst::Model', 'Catalyst::Plugin::Authentication', 'Catalyst::Plugin::ConfigLoader', 'Catalyst::Plugin::Static::Simple', 'Catalyst::TraitFor::Request::REST::ForBrowsers', 'Catalyst::View::JSON', 'Catalyst::View::TT::Alloy', 'CatalystX::RoleApplicator'],
	'Dancer'          : [ 'Dancer', 'Dancer::Plugin::DBIC', 'Dancer::Plugin::Auth::Extensible', 'Dancer::Plugin::Passphrase', 'Dancer::Plugin::Email', 'Dancer::Plugin::Lexicon', 'Dancer::Plugin::Auth::Extensible::Provider::Usergroup', 'Dancer::Plugin::Ajax', 'Dancer::Plugin::Database', 'Dancer::Plugin::EscapeHTML', 'Dancer::Session::Cookie' ],
	'Dancer2'         : [ 'Dancer2::Plugin::Path::Class', 'Dancer2::Plugin::DBIC', 'Dancer2::Plugin::Ajax', 'Dancer2::Plugin::Passphrase', 'Dancer2::Plugin::Auth::Extensible'],
	'database'        : [ 'DBI', 'DBIx::Class', 'DBD::mysql', 'DBD::SQLite', 'MongoDB' ],
	'date-time'       : [ 'DateTime', 'DateTime::Tiny' ],
	'email'           : [ 'Email::Valid', 'Email::Stuffer', 'Email::Sender' ],
	'excel'           : [ 'Spreadsheet::Read', 'Spreadsheet::ParseExcel' ],
	'exception'       : [ 'Try::Tiny' ],
	'json'            : [ 'JSON::MaybeXS', 'Mojo::JSON' ],
	'logging'         : [ 'Log::Log4perl', 'Log::Dispatch' ],
	'Moo'             : [ 'Moo', 'MooX::late', 'MooX::Types::MooseLike', 'MooX::Types::CLike', 'MooX::Singleton', 'MooX::Options'],
	'Moose'           : [ 'Moose', 'MooseX::ClassAttribute', 'MooseX::Role::Parameterized', 'MooseX::StrictConstructor', 'MooseX::Types::Common::Numeric', 'MooseX::Types::Common::String', 'MooseX::Types::Moose', 'MooseX::Types::URI'],

	'oop'             : [ 'Moose', 'Moo' ],
	'perl'            : [ 'Devel::NYTProf', 'Modern::Perl', 'Perl::Critic', 'Perl::Tidy', 'Module::Version', 'App::cpanminus', 'App::cpanoutdated', 'App::perlbrew', 'App::FatPacker', 'Carton', 'Pinto', 'local::lib' ],
	'psgi'            : [ 'Plack', 'Plack::Middleware::Assets', 'Plack::Middleware::ReverseProxy', 'Plack::Middleware::Runtime', 'Plack::Middleware::Headers', 'Plack::Middleware::ServerStatus::Lite', 'Plack::Middleware::Session', 'Plack::Middleware::Session::Cookie'],
	'templating'      : [ 'Template::Alloy', 'Template::Plugin::DateTime', 'Template::Plugin::JSON', 'Template::Plugin::Markdown', 'Template::Plugin::MultiMarkdown', 'Template::Plugin::Number::Format', 'Template::Plugin::Page'],
	'testing'         : [ 'Test::More', 'Test::Most', 'Devel::Cover', 'Test::Differences', 'Test::Code::TidyAll', 'Test::Mock::Simple', 'Test::MockTime', 'Test::Perl::Critic', 'Test::Version', 'Test::Warn', 'Test::WWW::Mechanize' ],
	'xml'             : [ 'XML::LibXML', 'XML::LibXSLT', 'XML::SAX', 'XML::Twig' ],
	'web-crawling'    : [ 'WWW::Mechanize', 'LWP::UserAgent', 'LWP::Simple', 'WWW::Selenium' ],
	'web-development' : [ 'Dancer2', 'Mojolicious', 'Plack', 'Catalyst', 'Template'],
	'web-server'      : [ 'Starman', 'Twiggy', 'PSGI' ]
};

