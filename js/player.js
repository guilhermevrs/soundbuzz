/*
player.js
author: guilhermevrs
*/

var Player = (function(){
    var me = {};

    options = {};
    options.containerId = 'content-target';

    var contentContainer = document.getElementById(options.containerId);

    var widget;

    function _prepareIframe(audioUrl){
        var iframe = document.querySelectorAll('#' + options.containerId + ' #player-iframe');
        if(iframe.length <= 0){
            iframe = document.createElement('iframe');
            iframe.id = 'player-iframe';
            contentContainer.insertBefore(iframe, contentContainer.firstChild);
            iframe.src = 'https://w.soundcloud.com/player/?url=' + audioUrl + '&auto_play=true';
        } else {
            iframe = iframe[0];
        }
        return iframe;
    }

    me.play = function(audioUrl){
        if(!widget){
            var iframe = _prepareIframe(audioUrl);
            widget = SC.Widget(iframe);
        } else {
            widget.load(audioUrl, {
                auto_play: true
            });
        }
        return true;
    };

    return me;
})();
