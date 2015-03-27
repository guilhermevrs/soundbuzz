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
    var currentSound;
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
        if(index === undefined){ //Coming from header player
            index = me.currentIndex;
        } else {
            //comming from miniatures
            if(me.currentIndex !== index){
                if(currentSound)
                    currentSound.stop();
                me.isPaused = false; //New music called
            }
            me.currentIndex = index;
        }
        if(loadTracks.length > index){
            var audioID = loadTracks[index].id;
        } else {
            console.error('No loaded tracks');
            return false;
        }

        if(me.isPaused){
            me.isPaused = false;
            currentSound.play();
            _onPlay(loadTracks[me.currentIndex]);
        } else {
            //New sound
            SC.stream('/tracks/' + audioID, function(sound){
                console.log(sound);
                currentSound = sound;
                me.isPaused = true;
                me.currentIndex = index;
                me.play();
            });
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
            currentSound.stop();
            return me.play();
        }
        return false;
    };

    me.backward = function(){
        if(me.currentIndex > 0){
            me.isPaused = false;
            currentSound.stop();
            me.currentIndex--;
            return me.play();
        }
        return false;
    };

    me.pause = function(){
        currentSound.pause();
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
