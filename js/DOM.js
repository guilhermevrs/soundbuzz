/*
DOM.js
author: morgl
*/

function onTrackShow(evt){
    var trackLen = evt.tracks.length;
    for(var i = 0; i < trackLen; i++){
        var track = evt.tracks[i];
        var itemContainer = $( "<div>", { class: "col-xs-12 col-sm-6 col-md-3 miniature placeholders"} );
        $( '<img />', { src : track.artwork_url.replace('large','t200x200') } ).appendTo(itemContainer);
        $( '<span>', { class : 'play glyphicon glyphicon-play' } ).appendTo(itemContainer);
        $('#content-target').append(itemContainer);   
    }
    if(evt.finish){
        console.log('FINISHED');
    }
};

$( "#content-target" ).on( "click", ".play, .pause", function() {
    console.log('FINISHED');
    $( this ).toggleClass("play glyphicon-play pause glyphicon-pause");
});

function formSubmit(){
    var mode = $('#cboModeSelector').val();
    var tags = $('#txtTags').val();
    var window = $('#cboWindowSelector').val();
    SoundBuzz.getBuzz(mode, tags, window, onTrackShow);
    return false;
};
