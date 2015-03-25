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
        $( '<img />', { src : track.artwork_url.replace('large','t200x200') } ).appendTo(miniatureContainer);
        $( '<span>', { 'data-trackindex': trackCount + i, class : 'play glyphicon glyphicon-play' } ).appendTo(miniatureContainer);
        $('#content-target').append(itemContainer);
    }
    if(evt.finish){
        console.log('FINISHED');
    }
};

$( "#content-target" ).on( "click", ".play, .pause", function() {
    var $this = $(this);
    $('#content-target').find('.pause').removeClass('pause glyphicon-pause');
    $this.toggleClass("play glyphicon-play pause glyphicon-pause");
    if(!Player.isPlaying)
        Player.play($this.data('trackindex'));
    else
        Player.pause();
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
    return false;
};

Player.togglePlayCallback = function(isPlaying){
    var span = $('#player-control-play').find('.glyphicon');
    if((Player.isPlaying && span.hasClass('glyphicon-play')) ||
      (!Player.isPlaying && span.hasClass('glyphicon-pause')))
    span.toggleClass('glyphicon-play').toggleClass('glyphicon-pause');
}
