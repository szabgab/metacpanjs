use Plack::Builder;
use strict;
use warnings;
use Plack::App::Directory;
builder {
  mount "/" => builder {
    enable "Plack::Middleware::DirIndex", dir_index => 'index.html';
    mount "/log/" => sub { return [ 200, [ 'Content-Type' => 'text/plain' ], [ '' ],] },
    mount "/" => Plack::App::Directory->new({ root => "app" })->to_app;
  };
};
