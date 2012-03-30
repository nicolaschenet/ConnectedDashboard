var express = require('express')
  , app     = express.createServer()
  , io      = require('socket.io').listen(app);

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
});

app.use('/static', express.static(__dirname + '/static'));

app.listen(1337);

app.get('/', function (req, res) {
  res.render('index', { page_title :  'Welcome to ConnectedDashboard' });
});

io.sockets.on('connection', function (socket) {
  socket.emit('connected', {
    message: 'Socket is now connected. Enjoy, guys ! ;)'
  });
});