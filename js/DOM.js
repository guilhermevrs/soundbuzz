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
        $( '<span>', { 'data-trackindex': trackCount + i, class : 'play glyphicon glyphicon-play' } ).appendTo(miniatureContainer);
        $('#content-target').append(itemContainer);
    }
    if(evt.finish){
        unloading();
        if (trackCount == 0){
            show_nothing_found();
        }
    }
};

$( "#content-target" ).on( "click", ".play, .pause", function() {
    $(this).toggleClass("play glyphicon-play pause glyphicon-pause");
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
    $('#content-target').html('');
    Player.clearTracks();
    loading();
    SoundBuzz.getBuzz(mode, tags, window, onTrackShow);
    return false;
};

function loading(){
    $('#overlay').addClass('loading');
    $('#overlay').append( $( '<div>', { id : 'loading' } ) );
};

function unloading(){
    $('#overlay').removeClass('loading');
    $('#loading').remove();
};


function show_nothing_found(){
    $('#content-target').html('');
    $( '<img />', { src   : 'img/badass.png', 
                    alt   : 'not found', 
                    class : 'placeholders' } ).appendTo('#content-target');
    $( '<p>', { class : 'badass', 
                text  : 'Watch out we got a badass over here' } ).appendTo('#content-target');
    $( '<p>', { class : 'nothing', 
                text  : 'Nothing matches your demands, your highness...'} ).appendTo('#content-target');
}

Player.togglePlayCallback = function(isPlaying){
    var span = $('#player-control-play').find('.glyphicon');
    if((Player.isPlaying && span.hasClass('glyphicon-play')) ||
      (!Player.isPlaying && span.hasClass('glyphicon-pause')))
    span.toggleClass('glyphicon-play').toggleClass('glyphicon-pause');
}
