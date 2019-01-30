var XRMP = require('xraudioplayer');
var xr = XRMP.XRAudioPlayer;
console.log(xr);

var collection2 = {
    'song 7': {
        coverURL: '../media/img/Blonde.png',
        audioURL: '../media/audio/Nights.mp3',
        metadata: {
            title: 'Nights',
            author: 'Frank Ocean',
            year: 2016
        }
    },
    'song 8': {
        coverURL: '../media/img/Scenes.png',
        audioURL: '../media/audio/ScenesFromAnItalianRestaurant.mp3',
        metadata: {
            title: 'Scenes from An Italian',
            author: 'Billy Joel',
            year: 1977
        }
    },
    'song 9': {
        coverURL: '../media/img/Yesterday.png',
        audioURL: '../media/audio/Yesterday.mp3',
        metadata: {
            title: 'Yesterday',
            author: 'Noname',
            year: 2016
        }
    },
};

xr.addFromList(collection2);

xr.spawn();
