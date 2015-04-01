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
    me.isRandom = false;

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
    
    me.getCurrentTrack = function(){
        return loadTracks[me.currentIndex];
    };
    
    me.addTracks = function(tracks){
        loadTracks = loadTracks.concat(tracks);
    };
    
    me.removeTrack = function(trackindex){
        if(loadTracks.length > trackindex)
            loadTracks.splice(trackindex, 1);
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
            if(me.isRandom)
                me.currentIndex = getRandomInt(0, loadTracks.length - 1);
            else
                me.currentIndex++;
            if(currentSound)
                currentSound.stop();
            return me.play();
        }
        return false;
    };

    me.backward = function(){
        if(me.currentIndex > 0){
            me.isPaused = false;
            if(currentSound)
                currentSound.stop();
            if(me.isRandom)
                me.currentIndex = getRandomInt(0, loadTracks.length - 1);
            else
                me.currentIndex--;
            return me.play();
        }
        return false;
    };

    me.pause = function(){
        if(currentSound)
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

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return me;
})();
