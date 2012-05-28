/* Author:
    Nicolas Chenet - nicolas@balloonup.com
*/

$(document).ready(function() {
    var socket = io.connect();
    socket
        .on('connected', function(data){
            $('.socket-status').removeClass('off').addClass('on');
            console.log(data.message);
        })
        .on('tweet', function(data){
            $('.no-tweet').css('position','absolute').fadeOut("slow");
            var tweet = JSON.parse(data.message);
            $('<li></li>')
                .addClass('tweet_'+tweet.id)
                .html(
                    '<img src="'+tweet.user.profile_image_url+'" alt="'+tweet.user.screen_name+' says..." />'
                +   '<a href="https://twitter.com/#!/'+tweet.user.screen_name+'" class="author" target="_blank">'
                +       '@'+tweet.user.screen_name+': '
                +   '</a>'
                +   tweet.text.parseURL().parseUsername().parseHashtag()
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
                tweetPlaceholderToggle();
            });
        })
        .on('instagram', function(data){
            var ig_newmedia = JSON.parse(data.message);
            var media = ig_newmedia.media;
            console.log('New update for channel : '+ig_newmedia.channelName);
            $('.live-instagram-pics li').remove();
            for (medium in media) {
                $('<li></li>')
                    .addClass('instagram_pic_'+media[medium].id)
                    .html(
                        '<a href="'+media[medium].images.standard_resolution.url+'" target="_blank" title="Shot by '+media[medium].user.full_name+', using the '+media[medium].filter+' filter">'
                    +       '<img src="'+media[medium].images.thumbnail.url+'" alt="Shot by '+media[medium].user.full_name+', using the '+media[medium].filter+' filter" />'
                    +   '</a>'
                    )
                    .appendTo('.live-instagram-pics')
                    .fadeIn("slow");
            }
        });
});



