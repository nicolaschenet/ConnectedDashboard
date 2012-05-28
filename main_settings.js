/**
 * Module dependencies.
 */

var express     = require('express')
  , routes      = require('./routes/store')
  , app         = express.createServer()
  , io          = require('socket.io').listen(app)
  , sys         = require('util')
  , url         = require('url');


/**
 * Configuration
 */


var app_settings = {
    author :      'Nicolas Chenet'
  , github_repo : 'https://github.com/nicolaschenet/ConnectedDashboard'
}


/**
 * App
 **/


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



exports.io            = io;
exports.app_settings  = app_settings;
exports.routes        = routes;
exports.app           = app;

