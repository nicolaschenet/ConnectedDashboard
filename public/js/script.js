/* Author:
    Nicolas Chenet - nicolas@balloonup.com
*/

function tweetPlaceholder() {
    $('.tweets li').length == 0 ? $('.no-tweet').fadeIn("slow") : $('.no-tweet').fadeOut("slow");
}

$(document).ready(function() {
    var socket = io.connect();
    socket
        .on('connected', function(data){
            console.log(data.message);
        })
        .on('tweet', function(data){
            $('.no-tweet').fadeOut("slow");
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
                .prependTo('.live-tweets')
                .fadeIn("slow");
        })
        .on('tweet_deleted', function(data){
            var deleted_tweet = data.message.status;
            $('.tweet_'+deleted_tweet.id).fadeOut("slow", function(){
                $(this).remove();
                tweetPlaceholder();
            });
        });
});



