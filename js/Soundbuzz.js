/*
Soundbuzz.js
author: guilhermevrs
*/

var SoundBuzz = (function(){
    var me = {}

    /*CONSTANTS*/
    var MAX_ITERATIONS = 3;

    me.iteration = 1;
    me.maxPlayCount = -1;
    me.minPlayCount = -1;

    me.setMode = function(mode){
        me.mode = mode;
    };

    me.setWindow = function(window){
        me.windowMode = window;
    };

    me.getBuzz = function(mode, tags, window, callback){
        me.setMode(mode);
        me.setWindow(window);
        me.tags = tags;
        me.callback = callback;

        me.iteration = 1;
        me.maxPlayCount = -1;
        me.minPlayCount = -1;
        me.referenceDate = new Date();
        _getTracks(_nextTimeInWindow());
    }

    function _padDatePart(part){
        return (part[1]?part:'0'+part[0]);
    }

    function _toSoundcloudDate(date){
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString(); //zero-based
        var dd = date.getDate().toString();
        var hh = date.getHours().toString();
        var MM = date.getMinutes().toString();
        var ss = date.getSeconds().toString();
        return yyyy + '-' + _padDatePart(mm) + '-' + _padDatePart(dd) + ' ' + _padDatePart(hh) + ':' + _padDatePart(MM) + ':' + _padDatePart(ss);
    };

    function _nextTimeInWindow(){
        var startTime = new Date();
        var endTime = new Date();
        var step;
        switch(me.windowMode){
            case 'Lat week': step = 2; break;
            case 'Last 2 weeks': step = 4; break;
            case 'Last month':
            default: step = 8; break;
        }
        var decrement = (me.iteration) * step;
        startTime.setDate(startTime.getDate() - decrement);
        endTime.setDate(endTime.getDate() - (decrement - step));
        return {
            from: _toSoundcloudDate(startTime),
            to: _toSoundcloudDate(endTime)
        };
    };

    function _processTracks(tracks){
        console.log(tracks.length);
        var filteredTracks = _filterTracks(tracks);
        console.log(filteredTracks);

        var callbackVal = {};
        callbackVal.finish = (me.iteration >= MAX_ITERATIONS);
        callbackVal.tracks = filteredTracks;

        if(me.callback){
            asyncCall(me.callback, callbackVal);
        }

        if(!callbackVal.finish){
            me.iteration++;
            _getTracks(_nextTimeInWindow());
        } else{
            console.log('MaxPlayCount', me.maxPlayCount, 'MinPlayCount', me.minPlayCount);
        }
    }

    function asyncCall(fn, value){
        setTimeout(function(){fn(value);}, 0);
    }

    function _filterTracks(tracks){
        var topFunc;
        var bottomFunc;
        switch(me.mode){
            case 'Buzzy': bottomFunc = _buzzyAlgo; break;
            case 'Trendy': bottomFunc = _trendyAlgo; topFunc = _buzzyAlgo; break;
            case 'Groovy': default:bottomFunc = _groovyAlgo; topFunc = _trendyAlgo; break;
        }

        var filteredTracks = [];
        var tracksLen = tracks.length;
        for(var i = 0; i < tracksLen ; i++){
            var referenceDate = new Date(tracks[i].created_at);
            var referenceDays = _getReferenceDays(referenceDate);
            var bottomRef = bottomFunc(referenceDays);
            var topRef;
            if(topFunc){
                topRef = topFunc(referenceDays);
            }
            if(tracks[i].playback_count > bottomRef && (!topRef || tracks[i].playback_count < topRef)){
                if(me.minPlayCount == -1 || me.minPlayCount > tracks[i].playback_count)
                    me.minPlayCount = tracks[i].playback_count;
                if(me.maxPlayCount == -1 || me.maxPlayCount < tracks[i].playback_count)
                    me.maxPlayCount = tracks[i].playback_count;
                filteredTracks.push(tracks[i]);
            }
        }

        return filteredTracks;
    }

    function _getReferenceDays(trackDate){
        var timeDiff = Math.abs(me.referenceDate.getTime() - trackDate.getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    function _buzzyAlgo(hour){
        //d + (a - d) / ( 1 + (x/c)^b )
        var a = 6598.582;
        var b = 2.857;
        var c = 11.715;
        var d = 2112895.000;
        return d + ( a - d ) / ( 1 + Math.pow( hour/c, b ) )
    };

    function _trendyAlgo(hour){
        var a = 1701.007;
        var b = 2.501;
        var c = 15.668;
        var d = 583022.100;
        return d + ( a - d ) / ( 1 + Math.pow( hour/c, b ) )
    }

    function _groovyAlgo(hour){
        var a = -287.476;
        var b = 1.956;
        var c = 15.480;
        var d = 155259.300;
        return d + ( a - d ) / ( 1 + Math.pow( hour/c, b ) )
    }

    function _getTracks(createAt){
        getOptions = {};
        getOptions.limit = 200;
        getOptions.created_at = createAt;
        if(me.tags && me.tags !== ''){
            getOptions.tags = me.tags;
        }
        console.log(getOptions);
        SC.get('/tracks', getOptions, _processTracks);
    };

    return me;
})();

SC.initialize({
  client_id: '581b5c41bbf8308284bfa16743d9c86d',
  redirect_uri: 'http://morganlema.fr/callback.html'   
});

$( '.connect' ).click(function(){
    if ( !( SC.isConnected() ) ) {
        connection();
    }   
});

function connection(){
    SC.connect(function() {
        SC.get('/me', function(me) { 
            welcome(me.username, me.permalink);
            add_like_button();
        });  
    }); 
};

/*SC.get('/playlists/19351492', function(playlist) {
  for (var i = 0; i < playlist.tracks.length; i++) {
    console.log(playlist.tracks[i]);
  }
});*/   
