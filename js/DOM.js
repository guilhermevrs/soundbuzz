/*
DOM.js
author: morgl
*/

var scrollingInterval;
var scrollOverflow = 0;

$( document ).ready(function() {
    $("#cboModeSelector").ionRangeSlider({
        grid: true,
        hide_min_max: true,
        from: 3,
        values: ["Buzzy", "Trendy", "Groovy"]
    });
    $("#cboWindowSelector").ionRangeSlider({
        grid: true,
        hide_min_max: true,
        from: 3,
        values: ["Last week", "Last 2 weeks", "Last month"]
    });
});

$('.tags-container').on('focus', 'input', function(){
    $(this).removeAttr('placeholder');
});

function onTrackShow(evt){
    var trackCount = Player.getTrackCount();
    Player.addTracks(evt.tracks);
    var trackLen = evt.tracks.length;
    for(var i = 0; i < trackLen; i++){
        var track = evt.tracks[i];
        var itemContainer = $( "<div>", { class: "col-xs-12 col-sm-6 col-md-3  placeholders"} );
        var miniatureContainer = $( '<div>', { class : 'miniature' } ).appendTo(itemContainer);
        if ( track.artwork_url ) {
            $( '<img />', { src : track.artwork_url.replace('large','t200x200') } ).appendTo(miniatureContainer);
        }
        $( '<span>', { 'data-trackindex': trackCount + i, class : 'miniature-play play glyphicon glyphicon-play' }     ).appendTo(miniatureContainer);
        $( '<button>', { class : 'close', text : 'x' } ).appendTo(miniatureContainer);
        itemContainer.appendTo('#content-target').hide().fadeIn(600);
    }
    if(evt.finish){
        unloading();
        if (trackCount == 0){
            show_nothing_found();
        }
    }
};

$( "#content-target" ).on( "click", ".play, .pause", function() {
    var $this = $(this);
    $this.toggleClass("play glyphicon-play pause glyphicon-pause");
    if(!Player.isPlaying){
        loading();
        if(!Player.play($this.data('trackindex')))
            unloading();
    }
    else {
        var myIndex = $(this).data('trackindex');
        if(Player.currentIndex == myIndex)
            Player.pause();
        else{
            loading();
            if(!Player.play(myIndex))
                unloading();
        }
    }
});

$( '#player-control-play' ).click(function(){
    if(!Player.isPlaying){
        loading();
        if(!Player.play())
            unloading();
    }
    else
        Player.pause();
});

$( '#player-control-backward' ).click(function(){
    loading();
    if(!Player.backward())
        unloading();
});

$( '#player-control-forward' ).click(function(){
    loading();
    if(!Player.forward())
        unloading();
});

$( "#content-target" ).on( "click", ".close", function() {
    var $this = $(this);
    trackIndex = $this.siblings("span").data("trackindex");
    var miniatures = $(".miniature-play");
    for (var i = miniatures.length - 1; i >= 0; i--){
        var currentMiniature = $(miniatures[i]);
        var currentTrackIndex = currentMiniature.data("trackindex");
        if ( currentTrackIndex > trackIndex ){
            currentMiniature.attr("data-trackindex", (--currentTrackIndex).toString());
            currentMiniature.data('trackindex', currentTrackIndex);
        }
        else{
            break;
        }
    }
    Player.removeTrack(trackIndex);
    $this.parent().parent().fadeOut(600, function(){
        $this.remove();
    });
});
    
$( '#player-control-random' ).click(function(){
    var $this = $(this).toggleClass('btn-active');
    Player.isRandom = !Player.isRandom;
});

$( '#player-control-like' ).click(function(){
    $this = $(this)
    if (SC.isConnected()) {
        currentTrack = Player.getCurrentTrack();
        if (currentTrack){
            currentTrackID = currentTrack.id
            var likeExists = SC.get('/me/favorites/', function(tracks) {
               for(var i = 0; i < tracks.length; i++){
                   if (tracks[i].id == currentTrackID){
                       SC.delete('/me/favorites/' + currentTrackID, function(){
                           if($this.hasClass("liked")){
                              $this.removeClass("liked");
                           }
                       });
                       return false;
                   }
               }
               SC.put('/me/favorites/' + currentTrackID, function(){
                   if(!$this.hasClass("liked")){
                      $this.addClass("liked");
                   }
               });
               return true;
            });
        }
    } 
    else {
        connection();
    }
});

function formSubmit(){
    clearTitleDisplay();
    var mode = $('#cboModeSelector').val();
    var tags = $('#txtTags').val();
    var window = $('#cboWindowSelector').val();
    $('#content-target').html('');
    Player.clearTracks();
    loading();
    SoundBuzz.getBuzz(mode, tags, window, onTrackShow);
    return false;
};

function loading(){
    $('#overlay').addClass('loading');
    $('#overlay').append( $( '<div>', { id : 'loading' } ) );
};

function unloading(){
    $('#overlay').removeClass('loading');
    $('#loading').remove();
};

function show_nothing_found(){
    $('#player-control-play').find('.glyphicon').removeClass('glyphicon-pause').addClass('glyphicon-play');
    $('#content-target').html('');
    $( '<img />', { src   : 'img/badass.png',
                    alt   : 'not found',
                    class : 'placeholders' } ).appendTo('#content-target');
    $( '<p>', { class : 'badass',
                text  : 'Watch out, we got a badass over here' } ).appendTo('#content-target');
    $( '<p>', { class : 'nothing',
                text  : 'Nothing matches your demands, your highness...'} ).appendTo('#content-target');
}

function clearTitleDisplay(){
    clearInterval(scrollingInterval);
    var titleDisplay = document.getElementById('player-current-title');
    while(titleDisplay.firstChild){
        titleDisplay.removeChild(titleDisplay.firstChild);
    }
    return titleDisplay;
}

function scrollTitleDisplay(element, step){
    var titleDisplay = element;
    var scrollPos = titleDisplay.scrollWidth - titleDisplay.offsetWidth;
    if(titleDisplay.scrollLeft >= scrollPos){
        scrollOverflow++;
        if(scrollOverflow == 6){
            titleDisplay.scrollLeft = 0;
            scrollOverflow = 0;
        }
    } else {
        titleDisplay.scrollLeft += step;
    }
}

Player.togglePlayCallback = function(playerInfo){

    if(playerInfo.sound){
        var sound = playerInfo.sound;
        var titleDisplay = clearTitleDisplay();
        trackLink = document.createElement('a');
        trackLink.setAttribute('href', sound.permalink_url);
        trackLink.setAttribute('target', '_blank');
        trackLink.textContent = (sound.user.username + ' - ' + sound.title);
        titleDisplay.appendChild(trackLink);
        document.title = titleDisplay.textContent;
        if(titleDisplay.scrollWidth > titleDisplay.offsetWidth){
            scrollingInterval = setInterval(function(){
                scrollTitleDisplay(titleDisplay, 5);
            }, 500);
        }
    }

    if(playerInfo.isPlaying)
        unloading();

    var headerPlay = $('#player-control-play').find('.glyphicon');
    var miniaturePlay = $('.miniature-play[data-trackindex='+playerInfo.trackIndex+']');
    $('.miniature-play.pause').toggleClass('play glyphicon-play pause glyphicon-pause');

    if((playerInfo.isPlaying && headerPlay.hasClass('glyphicon-play')) ||
      (!playerInfo.isPlaying && headerPlay.hasClass('glyphicon-pause'))){
        headerPlay.toggleClass('glyphicon-play glyphicon-pause');
    }
    miniaturePlay.toggleClass('play glyphicon-play pause glyphicon-pause');
    
    if (SC.isConnected()) {
        currentTrack = Player.getCurrentTrack();
        currentTrackID = currentTrack.id;
        var likeExists = SC.get('/me/favorites/', function(tracks) {
           for(var i = 0; i < tracks.length; i++){
               if (tracks[i].id == currentTrackID){
                   if(!$("#player-control-like").hasClass("liked")){
                        $("#player-control-like").addClass("liked");
                   }
                   return true;
               }
           }
           if($("#player-control-like").hasClass("liked")){
               $("#player-control-like").removeClass("liked");
           }
           return false;
        });
    } 
}

function welcome(username, permalink){
    var textContainer = $( "<ul>", { class: "nav nav-sidebar welcome placeholders"} );
    var userLink = "<a href='https://www.soundcloud.com/" + permalink + "'>" + username + "</a>" 
    textContainer.append("<li class='text-muted'>Welcome, " + userLink +" !</li>");
    $('#form').prepend(textContainer);
}

function add_like_button(){
    $("#player-control-like").css("display", "inline")
}