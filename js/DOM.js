/*
DOM.js
author: morgl
*/

function onTrackShow(evt){
    var trackLen = evt.tracks.length;
    for(var i = 0; i < trackLen; i++){
        var track = evt.tracks[i];
        var itemContainer = document.createElement('div');
            itemContainer.classList.add('col-md-9');
            itemContainer.classList.add('col-md-offset-1');
            itemContainer.classList.add('placeholders');

            SC.oEmbed(track.uri, {
                maxheight: '100%'
            },  itemContainer);

            var container = document.getElementById('content-target');
            container.appendChild(itemContainer);
    }
    if(evt.finish){
        console.log('FINISHED');
    }
};

function formSubmit(){
    var mode = jQuery('#cboModeSelector').val();
    var tags = jQuery('#txtTags').val();
    var window = jQuery('#cboWindowSelector').val();
    SoundBuzz.getBuzz(mode, tags, window, onTrackShow);
    return false;
};
