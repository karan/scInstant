$(document).ready(function(){

    $('#widget').empty();
    $('#error').empty();

    SC.initialize({
        client_id: '7182630dc6a6fc8aa606657648545826'
    });

    var iframe = document.querySelector('#widget');
    iframe.src = "http://w.soundcloud.com/player/?url=http://api.soundcloud.com/tracks/43315398";
    
    var widget = SC.Widget(iframe);

    var timer;

    // print the current playing sound
    var getSound = function() {
        widget.getCurrentSound(function(currentSound) {
            console.log('sound ' + currentSound.title + 'began to play');
        });
    }

    var getVol = function() {
        widget.getVolume(function(volume) {
            console.log('current volume value is ' + volume);
        });
    }

    // bind events to the widget
    widget.bind(SC.Widget.Events.READY, function() {
        widget.bind(SC.Widget.Events.PLAY, function(e) {
            // get information about currently playing sound
            getSound();
            getVol();
        });
    });


    // on page load, play something
    // instaSearch('Relax With Me');

    $('#searchterm').keyup(function(e) {
        // google analytics
        ga('send', 'event', 'input', 'search');

        var q = $("#searchterm").val();

        if (q == '' || q == undefined) {
            $('#widget').empty();
            $('#error').empty();
            // $('#error').append('Try searching for something.');
            return;
        }

        // search only if character key is pressed
        var c = String.fromCharCode(event.keyCode);
        var isWordCharacter = c.match(/\w/);
        var isBackspaceOrDelete = (event.keyCode == 8 || event.keyCode == 46);
        if ((!isWordCharacter && !isBackspaceOrDelete)) {
            return;
        }

        clearTimeout(timer);

        timer = setTimeout(function() {
            instaSearch(q);
        }, 200); // wait for 200ms after search query

    });

    function instaSearch(q) {
        SC.get('/tracks', { q: q, limit: 1 }, function(tracks) {
            if (tracks.length == 0) {
                $('#widget').empty();
                $('#error').empty();
                $('#error').append('No tracks found');
            } else {
                var track = tracks[0];
                $('#widget').empty();
                $('#error').empty();

                widget.load(track.uri, {
                    show_comments: false
                });
            }
        });
    }

});


