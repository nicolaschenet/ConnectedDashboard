/* Author:
    Nicolas Chenet - nicolas@balloonup.com
*/

$(document).ready(function() {
    var socket = io.connect();
    socket
        .on('connected', function(data){
            console.log(data.message);
        })
        .on('tweet', function(data){
            var tweet = JSON.parse(data.message);
            $('<li></li>')
                .addClass('tweet_'+tweet.id)
                .html(
                    '<img src="'+tweet.user.profile_image_url+'" alt="'+tweet.user.screen_name+' says..." />'
                +   '<a href="https://twitter.com/#!/'+tweet.user.screen_name+'" target="_blank">'
                +       '@'+tweet.user.screen_name+': '
                +   '</a>'
                +   tweet.text
                +   '<small>'
                +       tweet.created_at
                +   '</small>'
                )
                .prependTo('.tweets')
                .fadeIn("slow");
        })
        .on('tweet_deleted', function(data){
            console.log(data.message);
        });
});



