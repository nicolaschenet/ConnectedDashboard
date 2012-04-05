
/**
 * Module dependencies.
 */

var express = require('express')
  , routes  = require('./routes/store')
  , app     = module.exports = express.createServer()
  , io      = require('socket.io').listen(app);

// Configuration

var app_settings = {
    author :      'Nicolas Chenet'
  , github_repo : 'https://github.com/nicolaschenet/ConnectedDashboard'
}

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout : false,
    settings : app_settings
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'thisisnotsosecret' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/',  routes.home);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

io.sockets.on('connection', function (socket) {
  socket.emit('connected', {
    message: 'Socket is now connected. Enjoy, guys ! ;)'
  });
});