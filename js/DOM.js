/*
DOM.js
author: morgl
*/

function onTrackShow(evt){
    var trackCount = Player.getTrackCount();
    Player.addTracks(evt.tracks);
    var trackLen = evt.tracks.length;
    for(var i = 0; i < trackLen; i++){
        var track = evt.tracks[i];
        var itemContainer = $( "<div>", { class: "col-xs-12 col-sm-6 col-md-3  placeholders"} );
        var miniatureContainer = $( '<div>', { class : 'miniature' } ).appendTo(itemContainer);
        if ( track.artwork_url ) {
            $( '<img />', { src : track.artwork_url.replace('large','t200x200') } ).appendTo(miniatureContainer);
        }
        $( '<span>', { 'data-trackindex': trackCount + i, class : 'miniature-play play glyphicon glyphicon-play' } ).appendTo(miniatureContainer);
        $('#content-target').append(itemContainer);
    }
    if(evt.finish){
        $('#overlay').removeClass('loading');
        $('#loading').remove()
        console.log('FINISHED');
    }
};

$( "#content-target" ).on( "click", ".play, .pause", function() {
    var $this = $(this);
    $this.toggleClass("play glyphicon-play pause glyphicon-pause");
    if(!Player.isPlaying)
        Player.play($this.data('trackindex'));
    else {
        var myIndex = $(this).data('trackindex');
        if(Player.currentIndex == myIndex)
            Player.pause();
        else
            Player.play(myIndex);
    }
});

$( '#player-control-play' ).click(function(){
    if(!Player.isPlaying)
        Player.play();
    else
        Player.pause();
});

$( '#player-control-backward' ).click(function(){
    Player.backward();
});

$( '#player-control-forward' ).click(function(){
    Player.forward();
});

function formSubmit(){
    var mode = $('#cboModeSelector').val();
    var tags = $('#txtTags').val();
    var window = $('#cboWindowSelector').val();
    SoundBuzz.getBuzz(mode, tags, window, onTrackShow);
    $('#overlay').addClass('loading');
    $('#overlay').append( $( '<div>', { id : 'loading' } ) );
    return false;
};

Player.togglePlayCallback = function(playerInfo){
    var headerPlay = $('#player-control-play').find('.glyphicon');
    var miniaturePlay = $('.miniature-play[data-trackindex='+playerInfo.trackIndex+']');
    $('.miniature-play.pause').toggleClass('play glyphicon-play pause glyphicon-pause');
    if((playerInfo.isPlaying && headerPlay.hasClass('glyphicon-play')) ||
      (!playerInfo.isPlaying && headerPlay.hasClass('glyphicon-pause'))){
        headerPlay.toggleClass('glyphicon-play glyphicon-pause');
    }
    miniaturePlay.toggleClass('play glyphicon-play pause glyphicon-pause');
}
