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
    var loadTracks = [];

    function _prepareIframe(audioUrl){
        var iframe = document.querySelectorAll('#' + options.containerId + ' #player-iframe');
        if(iframe.length <= 0){
            iframe = document.createElement('iframe');
            iframe.id = 'player-iframe';
            contentContainer.insertBefore(iframe, contentContainer.firstChild);
            iframe.width = '100%';
            iframe.scrolling = 'no';
            iframe.frameBorder = 'no';
            iframe.src = 'https://w.soundcloud.com/player/?url=' + audioUrl + '&auto_play=true';
        } else {
            iframe = iframe[0];
        }
        return iframe;
    }

    me.play = function(audioUrl){
        if(!audioUrl || audioUrl === ''){
            if(loadTracks.length !== 0){
                audioUrl = loadTracks[0].uri;
            } else {
                console.error('No loaded tracks');
            }
        }

        if(!widget){
            var iframe = _prepareIframe(audioUrl);
            widget = SC.Widget(iframe);
            widget.bind(SC.Widget.Events.READY, function() {
                widget.bind(SC.Widget.Events.PLAY, function(evt){
                    widget.getCurrentSound(_onPlay);
                });
            });
        } else {
            widget.load(audioUrl, {
                auto_play: true
            });
        }
        return true;
    };

    me.addTracks = function(tracks){
        loadTracks = loadTracks.concat(tracks);
    };

    me.clearTracks = function(){
        loadTracks = [];
    };

    function _onPlay(sound){
        var titleDisplay = document.getElementById('player-current-title');
        titleDisplay.textContent = sound.user.username + ' - ' + sound.title;
    }

    return me;
})();
