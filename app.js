$(document).ready(function(){

    var client_id = '7182630dc6a6fc8aa606657648545826';

    $('#widget').empty();
    $('#error').empty();

    SC.initialize({
        client_id: client_id
    });

    var timer;
    var all_tracks = [];
    var audioElem = $("#widget")[0];

    // on page load, play something
    instaSearch('PARTYNEXTDOOR');

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
        SC.get('/tracks', { q: q, limit: 10 }, function(tracks) {
            if (tracks.length == 0) {
                $('#widget').empty();
                $('#error').empty();
                $('#error').append('No tracks found');
            } else {
                all_tracks = tracks;
                $('#widget').empty();
                $('#error').empty();

                var track = all_tracks.splice(0, 1)[0];
                playTrack(track);
            }
        });
    }

    // takes a track from SoundCloud and plays it.
    function playTrack(track) {
        // update the audio tag source
        SC.get(track.uri, {}, function(sound, error) {
          $('#widget').attr('src', sound.stream_url + '?client_id=' + client_id);
        });

        // set the title of the track
        $('#trackname').text(track.title);

        console.log("loaded " + track.title);
    }

    // toggle play and paused state of audio player
    window.toggle = function() {
        if (audioElem.paused) {
            audioElem.play();
        } else {
            audioElem.pause();
        }
    }

    // play the next song in queue and remove the track that
    // is to be played.
    window.next = function() {
        if (all_tracks.length != 0) {
            var track = all_tracks.splice(0, 1)[0];
            playTrack(track);
        } else {
            console.log("empty");
        }
    }

});
