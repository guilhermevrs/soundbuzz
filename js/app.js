/*
App.js
author: guilhermevrs
*/

SC.initialize({
  client_id: 'YOUR_CLIENT_ID'
});

SC.get('/playlists/1234323', function(playlist) {
  for (var i = 0; i < playlist.tracks.length; i++) {
    console.log(playlist.tracks[i].length);
  }
});
