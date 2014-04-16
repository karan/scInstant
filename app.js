$(document).ready(function(){

    $(document).height($(window).height());

    // SC api key
    var client_id = '7182630dc6a6fc8aa606657648545826';

    // store all tracks after a search query
    var all_tracks = [];

    // timer to search only after a while
    var timer;

    // iframe that stores the SC player
    var iframe = $("#widget")[0];

    // the SC Widget object
    var widget;

    SC.initialize({
        client_id: client_id
    });

    // on page load, start with a single song
    iframe.src = "http://w.soundcloud.com/player/?url=https://soundcloud.com/withlovexavier/drake-medley";
    widget = SC.Widget(iframe);

    // keyboard shortcut bindings
    $(document).keydown(function(e) {
        // this won't work if search field is focussed
        if (!$("#searchterm").is(':focus')) {
            // right arrow key pressed, play next
            if (e.keyCode == 39) {
                next();
            } else if (e.keyCode == 32) {
                toggle();
            }
        }
    });

    // print the current playing sound
    var getSound = function() {
        widget.getCurrentSound(function(currentSound) {
            console.log('sound ' + currentSound.title + 'began to play');
        });
    }

    // prints the volume of the player right now
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

    // main function that handles searching
    $('#searchterm').keyup(function(e) {
        // google analytics
        ga('send', 'event', 'input', 'search');

        var q = $("#searchterm").val();

        // validate query
        if (q == '' || q == undefined) {
            return;
        }

        // search only if character key is pressed
        var c = String.fromCharCode(event.keyCode);
        var isWordCharacter = c.match(/\w/);
        var isBackspaceOrDelete = (event.keyCode == 8 || event.keyCode == 46);
        if (!isWordCharacter && !isBackspaceOrDelete) {
            return;
        }

        clearTimeout(timer);

        timer = setTimeout(function() {
            instaSearch(q);
        }, 200); // wait for 200ms after search query

    });

    // searches and plays a track
    function instaSearch(q) {
        SC.get('/tracks', { q: q, limit: 10 }, function(tracks) {
            if (tracks.length == 0) {
                cleanUpSpace();
                $('#error').append('No tracks found');
            } else {
                all_tracks = tracks;
                var track = all_tracks.splice(0, 1)[0];
                playTrack(track);
            }
        });
    }

    // takes a track from SoundCloud and plays it.
    function playTrack(track) {
        cleanUpSpace();
        console.log(track.uri);
        // update the audio tag source
        widget.load(track.uri, {
            auto_play: true,
            buying: false,
            liking: false,
            download: false,
            sharing: false,
            show_playcount: false,
            show_comments: false
        });

        // set the title of the track
        $('#trackname').text(track.title);

        console.log("loaded " + track.title);
    }

    // toggle play and paused state of audio player
    window.toggle = function() {
        widget.toggle();
    }

    // play the next song in queue and remove the track that
    // is to be played.
    window.next = function() {
        if (all_tracks.length != 0) {
            var track = all_tracks.splice(0, 1)[0];
            playTrack(track);
        } else {
            cleanUpSpace();
            $('#error').append('No more songs. Try searching.');
            $('#searchterm').focus();
        }
    }

    var cleanUpSpace = function() {
        $('#widget').empty();
        $('#error').empty();
    }

});


