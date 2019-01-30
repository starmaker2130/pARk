function XRAudioPlayer(){
    var self = this;
    
    this.type ='xraudio';
    this.socket = null;

    this.spawn = function(){
        var self = this;
        self.socket = io.connect(location.host);
        //self.socket.emit('spawnXRAudioPlaylist', {status: true});
    };

    this.build = function(){
        console.log('spawning');
        self.application.core.tether = document.querySelector('#main-app-container');
        self.application.core.build();
    };

    this.add = function(coverURL, audioURL, metadata){
        var index;
        index = self.application.core.trackList.length;

        var track = {
            cover: coverURL,
            audio: audioURL,
            title: metadata.title,
            author: metadata.author,
            year: metadata.year,
            texture: `audio-cover-${index}`
        };

        //TODO move this line to another location; revise the logic of when the experience is actually rendered and document it
        
        //self.application.core.assetsContainer.append(`<img id='${track.texture}' src='${track.cover}' preload='true' />`);

        self.application.core.trackList.push(track);

       // console.log(`<img id='${track.texture}' src='${track.cover}' preload='true' />`);
    };

    this.addFromList = function(collection){
        var list = collection;

        for (var key in list) {
            // skip loop if the property is from prototype
            if (!list.hasOwnProperty(key)) continue;

            var obj = list[key];
            console.log('-------------');
            console.log(obj);
            self.add(obj.coverURL, obj.audioURL, obj.metadata);

            for (var prop in obj) {
                // skip loop if the property is from prototype
                if(!obj.hasOwnProperty(prop)) continue;

                // your code
                //alert(prop + " = " + obj[prop]);
                console.log(prop);
            }
        }
    }

    this.showTrackList = function(){
        var self = this;
        self.application.core.trackList;
        for(var i=0; i<self.application.core.trackList.length; i++){
            console.log(self.application.core.trackList[i].title);
        }
    }
    
    this.playNextTrack = function(){
        var self = this;
        self.application.core.playNextTrack();
    }
    
    this.playPreviousTrack = function(){
        var self = this;
        self.application.core.playPreviousTrack();
    }

    this.stream = function(){
        self.application.core.stream();
    };

    this.application = {
        focus: 0, // 0 = home; 1 = audio; 2 = visual; 3 = search
        renderer: {
            types: [
                'vr',
                'ar',
                'xr',
                'flat'
            ],
            dictionary: {
                'xraudio': function(){
                    console.log('execute handler for xraudioplayer object');
                }
            },
            createPointer: function(target){

            },
            buildElement: function(element){
                
            }
        },
        defaultAnimation: {
            addTrack: function(){
                let trackOverlay = document.querySelector('#add-track-overlay');
                trackOverlay.style.display = 'block';
                
                let animationStart = Date.now();
                let animationInterval = setInterval(function(){
                    let timeElapsed = Date.now() - animationStart;
                    if(timeElapsed>=1000){
                        trackOverlay.style.opacity = '1.0';
                        clearInterval(animationInterval);
                    }
                    trackOverlay.style.opacity = timeElapsed/1000+'';
                }, 20);
            }
        },
        core: {
            playNextTrack: function(){
                var core = self.application.core;
                
                core.stop();
                // stop playing

                if(core.index+1==core.trackList.length){
                    core.index=0;
                }
                else{
                    core.index = core.index+1;
                }
                
                console.log(`playing ${core.trackList[core.index].audio}`);

                document.querySelector('#song-title-container').setAttribute('value', core.trackList[core.index].title);
                
                document.querySelector('#meta-data-container').setAttribute('value', `author: ${core.trackList[core.index].author} \n\n year: ${core.trackList[core.index].year}`);

                document.querySelector('#audio-cover-artwork').setAttribute('material', `src:#${core.trackList[core.index].texture}; side: double;`);

                console.log(core.trackList[core.index].texture);

                core.source.setAttribute('src', core.trackList[core.index].audio);
                core.player.setAttribute('src', core.trackList[core.index].audio);
                core.play();
            },
            playPreviousTrack: function(){
                var core = self.application.core;

                core.stop();
                // stop playing

                if(core.index-1==-1){
                    core.index = core.trackList.length-1;
                }
                else{
                    core.index = core.index-1;
                }
                
                console.log(`playing ${core.trackList[core.index].audio}`);

                document.querySelector('#song-title-container').setAttribute('value', core.trackList[core.index].title);
                document.querySelector('#meta-data-container').setAttribute('value', `author: ${core.trackList[core.index].author} \n\n year: ${core.trackList[core.index].year}`);

                document.querySelector('#audio-cover-artwork').setAttribute('material', `src:#${core.trackList[core.index].texture}; side: double;`);

                console.log(core.trackList[core.index].texture);

                core.source.setAttribute('src', core.trackList[core.index].audio);
                core.player.setAttribute('src', core.trackList[core.index].audio);
                core.play();
            },
            assetsContainer: null,
            index: -1,
            trackList: [],
            spawn: function(){
                console.log('only available in npm package for security reasons');
            },
            player: null,
            play: function(){
                var core = self.core;
                
                if(core.player==null){
                    console.log('load a player first');
                }
                else{
                    core.player.play();
                }
            },
            pause: function(){
                var core = self.core;
                
                if(core.player==null){
                    console.log('nothing to pause. load a player first');
                }
                else{
                    core.player.pause();
                }
            },
            stop: function(){
                var core = self.application.core;
                
                if(core.player==null){
                    console.log('nothing to stop. load a player first');
                }
                else{
                    core.player.pause();
                }
            },
            source: null,
            stream: function(){
                var core = self.core;
                
                core.player = document.getElementById('html5-audio-player');
                core.source = document.getElementById('static-selector');

                document.querySelector("#html5-audio-player").addEventListener('ended', function(){
                    // done playing
                    if(self.index+1==self.trackList.length){
                        self.index=0;
                    }
                    else{
                        self.index = self.index+1;
                    }
                    console.log(`playing ${self.trackList[self.index].audio}`);

                    document.querySelector('#song-title-container').setAttribute('value', self.trackList[self.index].title);
                    document.querySelector('#meta-data-container').setAttribute('value', `author: ${self.trackList[self.index].author} \n\n year: ${self.trackList[self.index].year}`);

                    document.querySelector('#audio-cover-artwork').setAttribute('material', `src:#${self.trackList[self.index].texture}; side: double;`);

                    console.log(self.trackList[self.index].texture);

                    self.source.setAttribute('src', self.trackList[self.index].audio);
                    self.player.setAttribute('src', self.trackList[self.index].audio);
                    self.play();                
                });

                core.index=0;

                document.querySelector('#song-title-container').setAttribute('value', core.trackList[core.index].title);

                document.querySelector('#meta-data-container').setAttribute('value', `author: ${core.trackList[core.index].author} \n\n year: ${core.trackList[core.index].year}`);

                core.source.setAttribute('src', core.trackList[core.index].audio);
                core.player.setAttribute('src', core.trackList[core.index].audio);

                document.querySelector('#audio-cover-artwork').setAttribute('material', `src:#${core.trackList[core.index].texture}; side: double;`);

                core.play();
            },
            tether: null,
            makeTextureLoader: function(index){
                var target = index;
                document.querySelector('#embedded-assets-container').append(`<img id='${target.texture}' src='${target.coverURL}' preload='true' />`);
            },
            build: function(){
                var core = self.core;

                core.tether.append(`<a-scene embedded>
                        <a-assets id="embedded-assets-container">
                            <img id='floor-texture' src='../media/texture/grid_pattern.png' preload='true' />
                            <img id='starter' src='../media/img/hov-md.png' preload='true' />
                            <a-asset-item id="crate-obj" src="../media/model/omega.obj"></a-asset-item>
                            <a-asset-item id="crate-mtl" src="../media/model/omega.mtl"></a-asset-item>
                        </a-assets>

                        <a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='0 -180 180' material='side: double; color: red;' position='0  1 -1.5'>
                            <a-animation attribute="rotation"
                                         delay='3500'
                                         dur="2000"
                                         fill="forwards"
                                         to="-110 -180 180">
                            </a-animation>
                            <a-animation attribute="position"
                                         delay='3500'
                                         dur="2000"
                                         fill="forwards"
                                         to="0 0 -0.5">
                            </a-animation>
                            <a-text id='meta-data-container' rotation="0 0 0" position='0 0 0.5' align='center' value="this is where \n\n the song meta data will go \n\n against  a backdrop \n\n of the album cover" font='https://cdn.aframe.io/fonts/mozillavr.fnt'></a-text>
                        </a-entity>

                        <a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='180 90 0' material='side: double; color: yellow;' position='1 1 -2.5'>
                            <a-animation attribute="rotation"
                                         delay='3500'
                                         dur="2000"
                                         fill="forwards"
                                         to="290 90 0">
                            </a-animation>
                            <a-animation attribute="position"
                                         delay='3500'
                                         dur="2000"
                                         fill="forwards"
                                         to="2 0 -2.5">
                            </a-animation>
                            <a-text rotation="0 0 0" position='0 0 0.5' align='center' color='black' value="track list" font='https://cdn.aframe.io/fonts/mozillavr.fnt'></a-text>
                        </a-entity>

                        <a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='0 90 180' material='side: double; color: blue;' position='-1 1 -2.5'>
                            <a-animation attribute="rotation"
                                         delay='3500'
                                         dur="2000"
                                         fill="forwards"
                                         to="-110 90 180">
                            </a-animation>
                            <a-animation attribute="position"
                                         delay='3500'
                                         dur="2000"
                                         fill="forwards"
                                         to="-2 0 -2.5">
                            </a-animation>
                            <a-text rotation="0 0 0" position='0 0 0.5' align='center' value="edit" font='https://cdn.aframe.io/fonts/mozillavr.fnt'></a-text></a-entity>

                        <a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='0 0 0' material='side: double; color: aquamarine;' position='0 1 -2.5'>
                            <a-animation attribute="rotation"
                                         delay='3500'
                                         dur="2000"
                                         fill="forwards"
                                         to="-110 0 0">
                            </a-animation>
                            <a-animation attribute="position"
                                         delay='3500'
                                         dur="2000"
                                         fill="forwards"
                                         to="0 0 -4.5">
                            </a-animation>
                        </a-entity>

                        <a-entity geometry='primitive: plane; width: 3; height: 0.75;' position='0 4 -2' material='side: double; color: white; opacity: 0' >
                            <a-animation attribute="material.opacity"
                                         delay="3500"
                                         dur='2500'
                                         easing="linear"
                                         fill="forwards"
                                         to="0.5">
                            </a-animation>
                            <a-text id='song-title-container' rotation="0 0 0" position='0 0.2 0' align='center' value="song title" font='https://cdn.aframe.io/fonts/mozillavr.fnt' material='opacity: 0;'>
                                <a-animation attribute="material.opacity"
                                         delay="3500"
                                         dur='2500'
                                         easing="linear"
                                         fill="forwards"
                                         to="0.5">
                                </a-animation>
                            </a-text>
                        </a-entity>

                        <a-entity geometry='primitive: plane; width: 6; height: 3;' position='0 2 -4.25' material='side: double; color: white; opacity: 0' >
                            <a-animation attribute="material.opacity"
                                         delay="3500"
                                         dur='2500'
                                         easing="linear"
                                         fill="forwards"
                                         to="0.5">
                            </a-animation>
                            <a-entity geometry='primitive: plane; width: 2; height: 2;' position='-1.5 0 0.1' material='side: double; color: black; opacity: 0'  text='align: center; value: House of Venus\n\n (c) 2018; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt'>
                                <a-animation attribute="material.opacity"
                                         delay="3500"
                                         dur='2500'
                                         easing="linear"
                                         fill="forwards"
                                         to="0.5">
                            </a-animation>
                            </a-entity>
                            <a-entity geometry='primitive: plane; width: 2; height: 2;' position='1.5 0 0.1' material='side: double; color: black; opacity: 0' text='align: center; value: XR Audio Player\n\nv. 0.12.3; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt'>
                                <a-animation attribute="material.opacity"
                                         delay="3500"
                                         dur='2500'
                                         easing="linear"
                                         fill="forwards"
                                         to="0.5">
                            </a-animation>
                            </a-entity>
                        </a-entity>

                        <a-entity id="audio-cover-artwork" rotation="0 0 0" scale='0.1 0.1 0.1' position='0 2 -2' geometry="primitive: plane; width: 1; height: 1;" material="side: double; src: #starter;">
                            <a-animation attribute="rotation"
                                dur="20000"
                                easing="linear"
                                fill="forwards"
                                to="0 360 0"
                                repeat="indefinite">
                            </a-animation>
                            <a-animation attribute="scale"
                                         delay='3500'
                                         dur="2500"
                                         easing="linear"
                                         fill="forwards"
                                         to="3 3 3">
                            </a-animation>
                        </a-entity>

                        <a-entity geometry="primitive: plane; width: 100; height: 100;" rotation='-90 0 0' material='src: #floor-texture; repeat: 100 100; opacity: 1.0;'>
                            <a-animation attribute='material.opacity'
                                         delay='3000',
                                         dur='2000'
                                         fill='forwards'
                                         to='0'></a-animation>
                        </a-entity>

                        <a-entity position="2 0 2" rotation='0 45 0'>
                            <a-camera look-controls wasd-controls userHeight='1.8'></a-camera>
                        </a-entity>
                        <a-sky color='skyblue'></a-sky>
                    </a-scene><div style='position: absolute; width: 300px; height: 55px; border-radius: 25px; display: block; bottom: 5%; left: 50%; margin-left: -150px; z-index: 100; background-color: rgba(255, 255, 255, 0.7); cursor: pointer;'>
        <audio id='html5-audio-player' controls>
          <source id='static-selector' src="" type="audio/mpeg">
        Your browser does not support the audio element.
        </audio>
    </div>`);
                core.assetsContainer = document.querySelector('#embedded-assets-container');
            }
        }
    };

    this.view = 'scroll'; // scroll is the default, list is the secondary option, tertiary mode is the alternative AR or VR view

    this.XRSetting = 'flat'; // flat is default, ar is secondary, vr is tertiary
};