/*
App.js
author: guilhermevrs
*/

var SoundBuzz = (function(){
    var me = {}

    /*CONSTANTS*/
    var MAX_ITERATIONS = 3;

    me.iteration = 1;

    me.setMode = function(mode){
        me.mode = mode;
    };

    me.setWindow = function(window){
        me.windowMode = window;
    };

    me.getBuzz = function(mode, genres, tags, window){
        me.setMode(mode);
        me.setWindow(window);
        me.genres = genres;
        me.tags = tags;
        me.iteration = 1;
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
        var decrement;
        switch(me.windowMode){
            case 'hour':
            decrement = (me.iteration) * 15;
            startTime.setMinutes(startTime.getMinutes() - decrement);
            endTime.setMinutes(endTime.getMinutes() - (decrement - 15));
            break;
            case 'day':
            decrement = (me.iteration) * 6;
            startTime.setHours(startTime.getHours() - decrement);
            endTime.setMinutes(endTime.getMinutes() - (decrement - 6));
            break;
            case 'week':
            default:
            decrement = (me.iteration) * 2;
            startTime.setDate(startTime.getDate() - decrement);
            endTime.setDate(endTime.getDate() - (decrement - 2));
            break;
        }
        return {
            from: _toSoundcloudDate(startTime),
            to: _toSoundcloudDate(endTime)
        };
    };

    function _processTracks(tracks){
        console.log(tracks);
        var filteredTracks = _filterTracks(tracks);
        _upsertTracks(tracks);

        if(tracks.length > 0){
            var itemContainer = document.createElement('div');
            itemContainer.classList.add('col-md-9');
            itemContainer.classList.add('col-md-offset-1');
            itemContainer.classList.add('placeholders');

            SC.oEmbed(tracks[0].uri, {
                maxheight: '100%'
            },  itemContainer);

            var container = document.getElementById('content-target');
            container.appendChild(itemContainer);
        }

        if(me.iteration >= MAX_ITERATIONS){
            /*TODO: What to do when we already have all past data?*/
        } else {
            me.iteration++;
            _getTracks(_nextTimeInWindow());
        }
    }

    function _upsertTracks(tracks){
        /*TODO*/
    }

    function _filterTracks(tracks){
        /*TODO*/
        return tracks;
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

function formSubmit(){

}

SC.initialize({
  client_id: '581b5c41bbf8308284bfa16743d9c86d'
});

/*SC.get('/playlists/19351492', function(playlist) {
  for (var i = 0; i < playlist.tracks.length; i++) {
    console.log(playlist.tracks[i]);
  }
});*/
