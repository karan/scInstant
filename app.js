$(document).ready(function(){
    SC.initialize({
        client_id: '7182630dc6a6fc8aa606657648545826'
    });

    $('#searchterm').keyup(function(e) {
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

        SC.get('/tracks', { q: q }, function(tracks) {
            if (tracks.length == 0) {
                $('#widget').empty();
                $('#error').empty();
                $('#error').append('No tracks found');
            } else {
                var track = tracks[0];
                $('#widget').empty();
                $('#error').empty();
                SC.oEmbed(track.uri, document.getElementById("widget"));
            }
        });
    });
});
