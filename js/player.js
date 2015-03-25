/*
player.js
author: guilhermevrs
*/

var Player = (function(){
    var me = {};

    me.isPlaying = false;
    me.isPaused = false;
    me.togglePlayCallback;
    me.currentIndex = 0;

    options = {};
    options.containerId = 'iframe-container';

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

    me.play = function(index){
        if(!index){
            index = me.currentIndex;
        } else {
            if(me.currentIndex !== index)
                me.isPaused = false;
            me.currentIndex = index;
        }
        if(loadTracks.length > index){
            var audioUrl = loadTracks[index].uri;
        } else {
            console.error('No loaded tracks');
        }

        if(!widget){
            var iframe = _prepareIframe(audioUrl);
            widget = SC.Widget(iframe);
            widget.bind(SC.Widget.Events.READY, function() {
                widget.bind(SC.Widget.Events.PLAY, function(evt){
                    widget.getCurrentSound(_onPlay);
                });
                widget.bind(SC.Widget.Events.FINISH, function(evt){
                    _onFinish();
                });
            });
        } else {
            if(!me.isPaused){
                widget.load(audioUrl, {
                    auto_play: true
                });
            } else {
                me.isPaused = false;
                widget.play();
            }
        }
        return true;
    };

    me.addTracks = function(tracks){
        loadTracks = loadTracks.concat(tracks);
    };

    me.clearTracks = function(){
        loadTracks = [];
        if(widget){
            me.isPaused = false;
            me.isPlaying = false;
            widget.pause();
            var titleDisplay = document.getElementById('player-current-title');
        titleDisplay.textContent = '';
        }
    };

    me.forward = function(){
        if((loadTracks.length - 1) > me.currentIndex){
            me.isPaused = false;
            me.currentIndex++;
            me.play();
        }
    };

    me.backward = function(){
        if(me.currentIndex > 0){
            me.isPaused = false;
            me.currentIndex--;
            me.play();
        }
    };

    me.pause = function(){
        widget.pause();
        me.isPlaying = false;
        me.isPaused = true;
        if(me.togglePlayCallback){
            var playerInfo = {isPlaying : false};
            asyncCall(me.togglePlayCallback, playerInfo);
        }
    };

    me.getTrackCount = function(){
        return loadTracks.length;
    };

    function _onPlay(sound){
        var titleDisplay = document.getElementById('player-current-title');
        titleDisplay.textContent = sound.user.username + ' - ' + sound.title;
        me.isPlaying = true;
        if(me.togglePlayCallback){
            var playerInfo = {
                isPlaying : true,
                trackIndex : me.currentIndex
            };
            asyncCall(me.togglePlayCallback, playerInfo);
        }
    };

    function _onFinish(){
        me.isPlaying = false;
        if(me.togglePlayCallback)
            asyncCall(me.togglePlayCallback, false);
        me.forward();
    };

    function asyncCall(fn, params){
        setTimeout(function(){fn(params)},0);
    }

    return me;
})();
