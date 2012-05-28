var TwitterNode = require('twitter-node').TwitterNode;

var twit = new TwitterNode({
    user:     '#####'
  , password: '#####'
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

exports.twit = twit;
