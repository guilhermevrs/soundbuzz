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

    var currentSound;
    var loadTracks = [];

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
            SC.stream('/tracks/' + audioID, {onfinish:_onFinish},function(sound){
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
        if(currentSound){
            me.isPaused = false;
            me.isPlaying = false;
            currentSound.stop();
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
        me.isPlaying = true;
        if(me.togglePlayCallback){
            var playerInfo = {
                isPlaying : true,
                trackIndex : me.currentIndex,
                sound: sound
            };
            asyncCall(me.togglePlayCallback, playerInfo);
        }
    };

    function _onFinish(){
        me.isPlaying = false;
        var playerInfo = {
            isPlaying : false
        };
        if(me.togglePlayCallback)
            asyncCall(me.togglePlayCallback, false);
        me.forward();
    };

    function asyncCall(fn, params){
        setTimeout(function(){fn(params)},0);
    }

    return me;
})();
