/*
App.js
author: guilhermevrs
*/

SC.initialize({
  client_id: '581b5c41bbf8308284bfa16743d9c86d'
});

SC.get('/playlists/1234323', function(playlist) {
  for (var i = 0; i < playlist.tracks.length; i++) {
    console.log(playlist.tracks[i].length);
  }
});
