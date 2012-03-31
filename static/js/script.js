/* Author:
    Nicolas Chenet - nicolas@balloonup.com
*/

jQuery(document).ready(function() {
    var socket = io.connect();
    socket.on('connected', function(data){
        console.log(data.message);
    });
});



