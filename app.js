
/**
 * Module dependencies.
 */

var express     = require('express')
  , routes      = require('./routes/store')
  , app         = module.exports = express.createServer()
  , io          = require('socket.io').listen(app)
  , TwitterNode = require('twitter-node').TwitterNode
  , sys         = require('util');


/**
 * Configuration
 */

// App configuration

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


// Twitter configuration

var twit = new TwitterNode({
    user:     'nicolaschenet'
  , password: 'ha6vr851'
  , track:  [
        'ConnectedDashboard'
  ]
  , follow: [
        83561264  // @nicolaschenet
      , 142254877 // @guillaumepotier
      , 65804544  // @arcanis
      , 209020852 // @CeD_EF
      , 98431545  // @balloon
      , 42241156  // @Romaind
      , 295052629 // @ToGeoffreyh
      , 8314462   // @skruk
  ]
});


/**
 * Events
 */

// Twitter events

twit.addListener('error', function(error) {
  console.log(error.message);
});

twit
  .addListener('tweet', function(tweet) {
    sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);
    io.sockets.emit('tweet', {
        message : JSON.stringify(tweet)
    });
  })
  .addListener('limit', function(limit) {
    sys.puts("LIMIT: " + sys.inspect(limit));
  })
  .addListener('delete', function(del) {
    sys.puts("DELETE: " + sys.inspect(del));
    io.sockets.emit('tweet_deleted', {
      message: del
    });
  })
  .addListener('end', function(resp) {
    sys.puts("wave goodbye... " + resp.statusCode);
  })
  .stream();


// Generic socket events

io.sockets.on('connection', function (socket) {
  socket.emit('connected', {
    message: 'Socket is now connected. Enjoy, guys ! ;)'
  });
});


/**
 * Routes
 */

app.get('/',  routes.home);


/**
 * Let's listen to it now ;)
 **/

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});




