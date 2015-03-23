/*
DOM.js
author: morgl
*/

function formSubmit(){
    var mode = jQuery('#cboModeSelector').val();
    var tags = jQuery('#txtTags').val();
    var window = jQuery('#cboWindowSelector').val();
    SoundBuzz.getBuzz(mode, tags, window);
    return false;
}
