/*
App.js
author: guilhermevrs
*/

var SoundBuzz = (function(){
    var me = {}

    /*CONSTANTS*/
    var MAX_ITERATIONS = 3;

    me.iteration = 0;

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
        _getTracks(new Date());
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
        var newTime = new Date();
        switch(me.windowMode){
            case 'hour': newTime.setMinutes(newTime.getMinutes() - (me.iteration * 15)); break;
            case 'day': newTime.setHours(newTime.getHours() - (me.iteration * 6)); break;
            case 'week':
            default: newTime.setDate(newTime.getDate() - (me.iteration * 2));break;
        }
        return newTime;
    };

    function _processTracks(tracks){
        console.log(tracks);
        var filteredTracks = _filterTracks(tracks);
        _upsertTracks(tracks);

        var itemContainer = document.createElement('div');
        itemContainer.classList.add('col-md-9');
        itemContainer.classList.add('col-md-offset-1');
        itemContainer.classList.add('placeholders');

        SC.oEmbed(tracks[0].uri, {
            maxheight: '100%'
        },  itemContainer);

        var container = document.getElementById('content-target');
        container.appendChild(itemContainer);

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
        var scCreateAt = _toSoundcloudDate(createAt);
        console.log(scCreateAt);
        SC.get('/tracks', {
            genres: me.genres,
            tag_list: me.tags,
            created_at:{
                from: scCreateAt
            },
            limit:200
       }, _processTracks);
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
