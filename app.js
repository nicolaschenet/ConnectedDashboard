var url                     = require('url')
  , routes                  = require('./routes/store')
  , sys                     = require('util')
  , fs                      = require('fs')
  , main_settings           = require('./main_settings')
  , twitter_settings        = require('./twitter_settings')
  , instagram_settings      = require('./instagram_settings')
  , instagram_helpers       = require('./instagram_helpers')
  , instagram_subscriptions = 'channel:*'
  , crypto                  = require('crypto');


var app   = main_settings.app
  , io    = main_settings.io;

var redis = instagram_settings.redis;

var twit  = twitter_settings.twit;


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


// Instagram events

var r = redis.createClient(
    instagram_settings.REDIS_PORT,
    instagram_settings.REDIS_HOST);
r.psubscribe(instagram_subscriptions);


r.on('pmessage', function(pattern, channel, message){

    /* Every time we receive a message, we check to see if it matches
       the subscription pattern. If it does, then go ahead and parse it. */

    if(pattern == instagram_subscriptions){
        try {
            var data = JSON.parse(message)['data'];
            // Channel name is really just a 'humanized' version of a slug
            // san-francisco turns into san francisco. Nothing fancy, just
            // works.
            var channelName = channel.split(':')[1].replace(/-/g, ' ');
        } catch (e) {
            return;
        }

        // Store individual media JSON for retrieval by homepage later
        for(index in data){
            var media = data[index];
            media.meta = {};
            media.meta.location = channelName;
            var r = redis.createClient(
                instagram_settings.REDIS_PORT,
                instagram_settings.REDIS_HOST);
            r.lpush('media:objects', JSON.stringify(media));
            r.quit();
        }

        // Send out whole update to the listeners
        var update = {
            'type': 'newMedia',
            'media': data,
            'channelName': channelName
        };

        io.sockets.emit('instagram', {
            message : JSON.stringify(update)
        });

    }
});



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

app.get('/callbacks/geo/:geoName', function(request, response){
    // The GET callback for each subscription verification.
  var params = url.parse(request.url, true).query;
  response.send(params['hub.challenge'] || 'No hub.challenge present');
});


app.post('/callbacks/geo/:geoName', function(request, response){
    // The POST callback for Instagram to call every time there's an update
    // to one of our subscriptions.

    /* No more request.rawBody :/

    // First, let's verify the payload's integrity by making sure it's
    // coming from a trusted source. We use the client secret as the key
    // to the HMAC.
    var hmac = crypto.createHmac('sha1', instagram_settings.IG_CLIENT_SECRET);
    hmac.update(request.rawBody);
    var providedSignature = request.headers['x-hub-signature'];
    var calculatedSignature = hmac.digest(encoding='hex');

    // If they don't match up or we don't have any data coming over the
    // wire, then bail out early.
    if((providedSignature != calculatedSignature) || !request.body)
        response.send('FAIL');
    */


    // Go through and process each update. Note that every update doesn't
    // include the updated data - we use the data in the update to query
    // the Instagram API to get the data we want.
  var updates = request.body;
  var geoName = request.params.geoName;
  for(index in updates){
    var update = updates[index];
    if(update['object'] == "geography")
      instagram_helpers.processGeography(geoName, update);
  }
  response.send('OK');
});




/**
 * Let's listen to it now ;)
 **/

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});




