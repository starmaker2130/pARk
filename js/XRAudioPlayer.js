function XRAudioPlayer(name){
    if(name==null){
        throw new Error('Cannot initialize this component without a name. XR Audio Player spec. v. 0.0.4');
    }
    else{
        var self = this;

        this.type ='xraudio';
        this.socket = null;
        this.identity = name;
        
        console.log(`new xr componenet generated: \n ------------------ \n XRAudioPlayer v. 0.0.4 \n type: ${self.type} \n outgoing socket? ${(self.socket!=null)} \n objId: ${self.identity} \n ------------------`);
        
        this.spawn = function(){
            self.socket = io.connect(location.host);
            //self.socket.emit('spawnXRAudioPlaylist', {status: true});
        }

        this.build = function(){
            console.log(`[xraudio] Build player ${self.identity} from mark up.`);
            self.application.core.tether = document.querySelector('.embedded-scene-container');
            //console.log(self.application.core.tether);
            
            console.log(`[xraudio] ${self.identity} tethered to DOM.`);
            self.application.core.build();
        }
        
        this.render = function(){
            console.log('new build function goes here');
        }
        
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
        }

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
            self.application.core.trackList;
            for(var i=0; i<self.application.core.trackList.length; i++){
                console.log(self.application.core.trackList[i].title);
            }
        }

        this.playNextTrack = function(){
            self.application.core.playNextTrack();
        }

        this.playPreviousTrack = function(){
            self.application.core.playPreviousTrack();
        }

        this.stream = function(){
            self.application.core.stream();
        }

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
                    'xraudio': function(environment){
                        var renderView = self;

                        if(renderView!=null&&environment!=null){
                            environment.application.core.childList[self.identity] = renderView;

                            console.log('attaching xraudio component to environment.')

                            console.log('loading asset dependencies into experience asset container...');

                            for(var i=0; i<renderView.application.core.trackList.length; i++){
                                let track = renderView.application.core.trackList[i];
                                environment.application.renderer.buildElement.push({
                                    name: `#${track.texture}`,
                                    elementType: 'img',
                                    src: `${track.cover}`,
                                    preload: 'true'
                                });

                                console.log(`on track ${track.audio}`);

                                environment.stream('audio', self.identity, track.audio);
                            }

                            environment.application.core.experience.push({
                                name: '.xraudioplayer',
                                order: 0,
                                elementType: 'xraudio',
                                build: {
                                    raw: `
                            <a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='0 -180 180' material='side: double; color: red;' position='0  1 -1.5' animation__rotation="property: rotation; delay: 3500; dur: 2000; fill: forwards; to: -110 -180 180" animation__position="property: position; delay: 3500; dur: 2000; fill: forwards; to: 0 0 -0.5">
                                <a-text id='meta-data-container' rotation="0 0 0" position='0 0 0.5' align='center' value="this is where \n\n the song meta data will go \n\n against  a backdrop \n\n of the album cover" font='https://cdn.aframe.io/fonts/mozillavr.fnt'></a-text>
                            </a-entity>

                            <a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='180 90 0' material='side: double; color: yellow;' position='1 1 -2.5' animation__rotation="property: rotation; delay: 3500; dur: 2000; fill: forwards; to: 290 90 0" animation__position="property: position; delay: 3500; dur: 2000; fill: forwards; to: 2 0 -2.5">
                                <a-text rotation="0 0 0" position='0 0 0.5' align='center' color='black' value="track list" font='https://cdn.aframe.io/fonts/mozillavr.fnt'></a-text>
                            </a-entity>

                            <a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='0 90 180' material='side: double; color: blue;' position='-1 1 -2.5' animation__rotation="property: rotation; delay: 3500; dur: 2000; fill: forwards; to: -110 90 180" animation__position="property: position; delay: 3500; dur: 2000; fill: forwards; to: -2 0 -2.5">
                                <a-text rotation="0 0 0" position='0 0 0.5' align='center' value="edit" font='https://cdn.aframe.io/fonts/mozillavr.fnt'></a-text>
                            </a-entity>

                            <a-entity class='panel-container' geometry="primitive: plane; width: 2; height: 2;" rotation='0 0 0' material='side: double; color: aquamarine;' position='0 1 -2.5' animation__rotation="property: rotation; delay: 3500; dur: 2000; fill: forwards; to: -110 0 0" animation__position="property: position; delay: 3500; dur: 2000; fill: forwards; to: 0 0 -4.5">
                            </a-entity>

                            <a-entity class='title-container' geometry='primitive: plane; width: 3; height: 0.75;' position='0 4 -2' material='side: double; color: white; opacity: 0' animation__flash="property: material.opacity; delay: 3500; dur: 2500; easing: linear; fill: forwards; to: 0.5">
                                <a-text id='song-title-container' rotation="0 0 0" position='0 0.2 0' align='center' value="song title" font='https://cdn.aframe.io/fonts/mozillavr.fnt' material='opacity: 0;' animation__transition="property: material.opacity; delay: 3500; dur: 2500; easing: linear; fill: forwards; to: 0.5">
                                </a-text>
                            </a-entity>

                            <a-entity geometry='primitive: plane; width: 6; height: 3;' position='0 2 -4.25' material='side: double; color: white; opacity: 0' animation__glimmer="property: material.opacity; delay: 3500; dur: 2500; easing: linear; fill: forwards; to: 0.5">
                                <a-entity geometry='primitive: plane; width: 2; height: 2;' position='-1.5 0 0.1' material='side: double; color: black; opacity: 0'  text='align: center; value: House of Venus\n\n (c) 2018; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt' animation__rotation="property: material.opacity; delay: 3500; dur: 2500; easing: linear; fill: forwards; to: 0.5">
                                </a-entity>
                                <a-entity geometry='primitive: plane; width: 2; height: 2;' position='1.5 0 0.1' material='side: double; color: black; opacity: 0' text='align: center; value: XR Audio Player\n\nv. 0.12.3; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt' animation__rotation="property: material.opacity; delay: 3500; dur: 2500; easing: linear; fill: forwards; to: 0.5">
                                </a-entity>
                            </a-entity>

                            <a-entity id="audio-cover-artwork" rotation="0 0 0" scale='0.1 0.1 0.1' position='0 2 -2' geometry="primitive: plane; width: 1; height: 1;" material="side: double; src: ;" animation__rotation="property: rotation; dur: 20000; easing: linear; fill: forwards; to: 0 360 0" animation__position="property: scale; delay: 3500; dur: 2500; easing: linear; fill: forwards; to: 3 3 3">
                            </a-entity>

                            <a-entity geometry="primitive: plane; width: 100; height: 100;" rotation='-90 0 0' material='src: #floor-texture; repeat: 100 100; opacity: 1.0;' animation__rotation="property: material.opacity; delay: 3000; dur: 2000; fill: forwards; to: 0">
                            </a-entity>
    `,
                                    components: [
                                        {
                                            name: '.song-meta-data-panel-container',
                                            order: 0,
                                            elementType: 'a-entity',
                                            geometry: "primitive: plane; width: 2; height: 2;",
                                            rotation: "-110 -180 180", //'0 -180 180',
                                            material: 'side: double; color: red;',
                                            position: "0 0.5 -0.5", //'0  1 -1.5',
                                            children: [
                                                {
                                                    name: '#song-meta-data-panel-text',
                                                    order: 1,
                                                    elementType: 'a-text',
                                                    name: '#meta-data-container',
                                                    rotation: "0 0 0",
                                                    position: '0 0 0.5',
                                                    align: 'center',
                                                    value: "this is where \n\n the song meta data will go \n\n against  a backdrop \n\n of the album cover",
                                                    font: 'https://cdn.aframe.io/fonts/mozillavr.fnt'
                                                }
                                            ]
                                        },
                                        {
                                            name: '.track-list-panel-container',
                                            order: 0,
                                            elementType: 'a-entity',
                                            geometry: "primitive: plane; width: 2; height: 2;",
                                            rotation: "290 90 0", //'180 90 0',
                                            material: 'side: double; color: yellow;',
                                            position: "2 0.5 -2.5", //'1 1 -2.5',
                                            children: [
                                                {
                                                    name: '#track-list-panel-text',
                                                    order: 1,
                                                    elementType: 'a-text',
                                                    rotation:"0 0 0",
                                                    position: '0 0 0.5',
                                                    align: 'center',
                                                    color: 'black',
                                                    value: "track list",
                                                    font: 'https://cdn.aframe.io/fonts/mozillavr.fnt'
                                                }
                                            ]
                                        },
                                        {
                                            name: '.edit-panel-text-container',
                                            order: 0,
                                            elementType: 'a-entity',
                                            geometry: "primitive: plane; width: 2; height: 2;",
                                            rotation: "-110 90 180", //'0 90 180',
                                            material: 'side: double; color: blue;',
                                            position: "-2 0.5 -2.5", //'-1 1 -2.5',
                                            children: [
                                                {   
                                                    name: '#edit-panel-text',
                                                    order: 1,
                                                    elementType: 'a-text',
                                                    rotation: "0 0 0",
                                                    position: '0 0 0.5',
                                                    align: 'center',
                                                    value: "edit",
                                                    font: 'https://cdn.aframe.io/fonts/mozillavr.fnt'
                                                }
                                            ]
                                        },
                                        {
                                            name: '.panel-container',
                                            order: 0,
                                            elementType: 'a-entity',
                                            geometry: "primitive: plane; width: 2; height: 2;",
                                            rotation: "-110 0 0", //'0 0 0',
                                            material: 'side: double; color: aquamarine;',
                                            position: "0 0.5 -3.5", //'0 1 -2.5',
                                            children: [
                                            ]
                                        },
                                        {
                                            name: '.title-container',
                                            order: 0,
                                            elementType: 'a-entity',
                                            geometry: 'primitive: plane; width: 3; height: 0.75;' ,
                                            position: '0 3.5 -2',
                                            material:'side: double; color: white; opacity: 0.5', //opacity: 0
                                            children: [
                                                {
                                                    name: '#song-title-container',
                                                    order: 1,
                                                    elementType: 'a-text',
                                                    rotation:"0 0 0",
                                                    position:'0 0.2 0',
                                                    align:'center',
                                                    value:"song title", font:'https://cdn.aframe.io/fonts/mozillavr.fnt',
                                                    material:'opacity: 0.5;', //opacity: 0
                                                    children: [
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            name: '.hov-company-panel-container',
                                            order: 0,
                                            elementType: 'a-entity',
                                            geometry:'primitive: plane; width: 6; height: 3;',
                                            position:'0 2 -4.25',
                                            material:'side: double; color: white; opacity: 0.5', //opacity: 0
                                            children: [
                                                {
                                                    name: '.hov-company-panel',
                                                    order: 1,
                                                    elementType: 'a-entity',
                                                    geometry:'primitive: plane; width: 2; height: 2;',
                                                    position:'-1.5 0 0.1',
                                                    material:'side: double; color: black; opacity: 0.5', //opacity: 0
                                                    text:'align: center; value: House of Venus\n\n (c) 2019; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt',
                                                    children: [
                                                    ]
                                                },
                                                {
                                                    name: '.xraudioplayer-version-panel',
                                                    order: 0,
                                                    elementType: 'a-entity',
                                                    geometry:'primitive: plane; width: 2; height: 2;',
                                                    position:'1.5 0 0.1',
                                                    material:'side: double; color: black; opacity: 0.5', //opacity: 0
                                                    text:'align: center; value: XR Audio Player\n\nv. 0.0.4; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt',
                                                    children:[
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            name: '#audio-cover-artwork',
                                            order: 0,
                                            elementType: 'a-entity',
                                            rotation: "0 360 0",//"0 0 0",
                                            scale:'0.1 1.1 0.1',
                                            position: "0 1.75 -2",//'0 2 -2',
                                            geometry:"primitive: plane; width: 1.75; height: 1.75;",
                                            material:"side: double; src: ;",
                                            children: [
                                            ]
                                        },
                                    ]
                                }
                            });
                        }
                        else{
                            console.log('execute handler for xraudioplayer object');
                        }
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
                    var core = self.application.core;

                    if(core.player==null){
                        console.log('load a player first');
                    }
                    else{
                        core.player.play();
                    }
                },
                pause: function(){
                    var core = self.application.core;

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
                    var core = self.application.core;

                    core.player = document.getElementById('html5-audio-player');
                    core.source = document.getElementById('static-selector');

                    document.querySelector("#html5-audio-player").addEventListener('ended', function(){
                        // done playing
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
                    document.querySelector('.embedded-assets-container').append(`<img id='${target.texture}' src='${target.coverURL}' preload='true' />`);
                },
                build: function(){
                    var core = self.application.core;
                    
                    var entity0 = document.createElement('a-entity');
                    
                    entity0.setAttribute('geometry', 'primitive: plane; width: 2; height: 2;');
                    entity0.setAttribute('rotation', '0 -180 180');
                    entity0.setAttribute('material', 'side: double; color: red;');
                    entity0.setAttribute('position', '0 1 -1.5');
                    entity0.setAttribute('animation__rotate0','property: rotation; delay: 3500; dur: 2000;  to: -110 -180 180;');
                    entity0.setAttribute('animation__position0','property: position; delay: 3500; dur: 2000;  to: 0 0 -1.5;');
                    
                    /*var animation0 = document.createElement('a-animation');
                    
                    animation0.setAttribute('attribute', 'rotation');
                    animation0.setAttribute('delay', '3500');
                    animation0.setAttribute('dur', '2000');
                    animation0.setAttribute('fill', 'forwards');
                    animation0.setAttribute('to', '-110 -180 180');
                    
                    var animation1 = document.createElement('a-animation');
                    
                    animation1.setAttribute('attribute', 'position');
                    animation1.setAttribute('delay', '3500');
                    animation1.setAttribute('dur', '2000');
                    animation1.setAttribute('fill', 'forwards');
                    animation1.setAttribute('to', '0 0 -0.5');
                    */
                    var text0 = document.createElement('a-text');
                    
                    text0.setAttribute('id', 'meta-data-container');
                    text0.setAttribute('rotation', '0 0 0');
                    text0.setAttribute('value', 'this is where \n\n the song meta data will go \n\n against  a backdrop \n\n of the album cover');
                    text0.setAttribute('position', '0 0 0.5');
                    text0.setAttribute('font', 'https://cdn.aframe.io/fonts/mozillavr.fnt');
                    
                    /*entity0.appendChild(animation0);
                    entity0.appendChild(animation1);*/
                    entity0.appendChild(text0);
                    
                    ///////////////////////////////
                    
                    var entity1 = document.createElement('a-entity');
                    
                    entity1.setAttribute('geometry', 'primitive: plane; width: 2; height: 2;');
                    entity1.setAttribute('rotation', '180 90 0');
                    entity1.setAttribute('material', 'side: double; color: yellow;');
                    entity1.setAttribute('position', '1 1 -2.5');
                    entity1.setAttribute('animation__rotate1','property: rotation; delay: 3500; dur: 2000; to: 290 90 0;');
                    entity1.setAttribute('animation__position1','property: position; delay: 3500; dur: 2000;  to: 2 0 -2.5;');
                    
                    /*var animation2 = document.createElement('a-animation');
                    
                    animation2.setAttribute('attribute', 'rotation');
                    animation2.setAttribute('delay', '3500');
                    animation2.setAttribute('dur', '2000');
                    animation2.setAttribute('fill', 'forwards');
                    animation2.setAttribute('to', '290 90 0');

                    var animation3 = document.createElement('a-animation');
                    
                    animation3.setAttribute('attribute', 'position');
                    animation3.setAttribute('delay', '3500');
                    animation3.setAttribute('dur', '2000');
                    animation3.setAttribute('fill', 'forwards');
                    animation3.setAttribute('to', '2 0 -2.5');*/
                              
                    var text1 = document.createElement('a-text');
                    
                    text1.setAttribute('rotation', '0 0 0');
                    text1.setAttribute('value', 'track list');
                    text1.setAttribute('position', '0 0 0.5');
                    text1.setAttribute('align', 'center');
                    text1.setAttribute('color', 'black');
                    text1.setAttribute('font', 'https://cdn.aframe.io/fonts/mozillavr.fnt');
                    
                    //entity1.appendChild(animation2);
                    //entity1.appendChild(animation3);
                    entity1.appendChild(text1);

                    ///////////////////////////////
                    
                    var entity2 = document.createElement('a-entity');
                    entity2.setAttribute('geometry', 'primitive: plane; width: 2; height: 2;');
                    entity2.setAttribute('rotation', '0 90 180');
                    entity2.setAttribute('material', 'side: double; color: blue;');
                    entity2.setAttribute('position', '-1 1 -2.5');
                    entity2.setAttribute('animation__rotate2','property: rotation; delay: 3500; dur: 2000; to: -110 90 180;');
                    entity2.setAttribute('animation__position2','property: position; delay: 3500; dur: 2000;  to: -2 0 -2.5;');
                    
                    /*var animation4 = document.createElement('a-animation');
                    animation4.setAttribute('attribute', 'rotation');
                    animation4.setAttribute('delay', '3500');
                    animation4.setAttribute('dur', '2000');
                    animation4.setAttribute('fill', 'forwards');
                    animation4.setAttribute('to', '-110 90 180');
                                                     
                    var animation5 = document.createElement('a-animation');
                    animation5.setAttribute('attribute', 'position');
                    animation5.setAttribute('delay', '3500');
                    animation5.setAttribute('dur', '2000');
                    animation5.setAttribute('fill', 'forwards');
                    animation5.setAttribute('to', '-2 0 -2.5');*/
                    
                    var text2 = document.createElement('a-text');
                    
                    text2.setAttribute('rotation', '0 0 0');
                    text2.setAttribute('value', 'edit');
                    text2.setAttribute('position', '0 0 0.5');
                    text2.setAttribute('align', 'center');
                    text2.setAttribute('font', 'https://cdn.aframe.io/fonts/mozillavr.fnt');
                    
                    //entity2.appendChild(animation4);
                    //entity2.appendChild(animation5);
                    entity2.appendChild(text2);
                    
                    ///////////////////////////////
                    
                    var entity3 = document.createElement('a-entity');
                    
                    entity3.classList.add('panel-container');
                    entity3.setAttribute('geometry', 'primitive: plane; width: 2; height: 2;');
                    entity3.setAttribute('rotation', '0 0 0');
                    entity3.setAttribute('material', 'side: double; color: aquamarine;');
                    entity3.setAttribute('position', '0 1 -2.5');
                    entity3.setAttribute('animation__rotate3','property: rotation; delay: 3500; dur: 2000; to: -110 0 0;');
                    entity3.setAttribute('animation__position3','property: position; delay: 3500; dur: 2000;  to: 0 0 -4.5;');
                    
                    /*var animation6 = document.createElement('a-animation');
                    
                    animation6.setAttribute('attribute', 'rotation');
                    animation6.setAttribute('delay', '3500');
                    animation6.setAttribute('dur', '2000');
                    animation6.setAttribute('fill', 'forwards');
                    animation6.setAttribute('to', '-110 0 0');
                                                     
                    var animation7 = document.createElement('a-animation');
                    
                    animation7.setAttribute('attribute', 'position');
                    animation7.setAttribute('delay', '3500');
                    animation7.setAttribute('dur', '2000');
                    animation7.setAttribute('fill', 'forwards');
                    animation7.setAttribute('to', '0 0 -4.5');*/
                    
                    //entity3.appendChild(animation6);
                    //entity3.appendChild(animation7);
                    
                    ///////////////////////////////

                    var entity4 = document.createElement('a-entity');
                    entity4.classList.add('title-container');
                    entity4.setAttribute('geometry', 'primitive: plane; width: 3; height: 0.75;');
                    entity4.setAttribute('material', 'side: double; color: white; opacity: 0');
                    entity4.setAttribute('position', '0 4 -2');
                    entity4.setAttribute('animation__flash','property: material.opacity; delay: 3500; dur: 2500; to: 0.5;');
                    
                    /*var animation8 = document.createElement('a-animation');
                    animation8.setAttribute('attribute', 'material.opacity');
                    animation8.setAttribute('delay', '3500');
                    animation8.setAttribute('dur', '2500');
                    animation8.setAttribute('easing', 'linear');
                    animation8.setAttribute('fill', 'forwards');
                    animation8.setAttribute('to', '0.5');*/
                    
                    var text3 = document.createElement('a-text');
                    
                    text3.setAttribute('rotation', '0 0 0');
                    text3.setAttribute('id', 'song-title-container')
                    text3.setAttribute('value', 'song title');
                    text3.setAttribute('position', '0 0.2 0');
                    text3.setAttribute('align', 'center');
                    text3.setAttribute('material', 'opacity: 0');
                    text3.setAttribute('font', 'https://cdn.aframe.io/fonts/mozillavr.fnt');
                    text3.setAttribute('animation__sparkle','property: material.opacity; delay: 3500; dur: 2500; to: 0.5;');
                    
                    /*var animation9 = document.createElement('a-animation');
                    
                    animation9.setAttribute('attribute', 'material.opacity');
                    animation9.setAttribute('delay', '3500');
                    animation9.setAttribute('dur', '2500');
                    animation9.setAttribute('easing', 'linear');
                    animation9.setAttribute('fill', 'forwards');
                    animation9.setAttribute('to', '0.5');*/
                    
                    
                    //entity4.appendChild(animation8);
                    //text3.appendChild(animation9);
                    entity4.appendChild(text3);
                    
                    ///////////////////////////////
                    
                    var entity5 = document.createElement('a-entity');
                    
                    entity5.setAttribute('geometry', 'primitive: plane; width: 6; height: 3;');
                    entity5.setAttribute('material', 'side: double; color: white; opacity: 0');
                    entity5.setAttribute('position', '0 2 -4.25');
                    entity5.setAttribute('animation__glimmer','property: material.opacity; delay: 3500; dur: 2500; easing: linear; to: 0.5;');
                    
                    /*var animation10 = document.createElement('a-animation');
                    
                    animation10.setAttribute('attribute', 'material.opacity');
                    animation10.setAttribute('delay', '3500');
                    animation10.setAttribute('dur', '2500');
                    animation10.setAttribute('easing', 'linear');
                    animation10.setAttribute('fill', 'forwards');
                    animation10.setAttribute('to', '0.5');*/
                    
                    //entity5.appendChild(animation10);
                    
                    ////
                    
                    var entity6 = document.createElement('a-entity');
                    
                    entity6.setAttribute('geometry', 'primitive: plane; width: 2; height: 2;');
                    entity6.setAttribute('material', 'side: double; color: black; opacity: 0');
                    entity6.setAttribute('position', '-1.5 0 0.1');
                    entity6.setAttribute('text', 'align: center; value: House of Venus\n\n (c) 2019; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt');
                    entity6.setAttribute('animation__gleam','property: material.opacity; delay: 3500; dur: 2500; easing: linear; to: 0.5;');
                    
                    /*var animation11 = document.createElement('a-animation');
                    
                    animation11.setAttribute('attribute', 'material.opacity');
                    animation11.setAttribute('delay', '3500');
                    animation11.setAttribute('dur', '2500');
                    animation11.setAttribute('easing', 'linear');
                    animation11.setAttribute('fill', 'forwards');
                    animation11.setAttribute('to', '0.5');

                    entity6.appendChild(animation11);*/
                    
                    ////
                    
                    var entity7 = document.createElement('a-entity');
                    
                    entity7.setAttribute('geometry', 'primitive: plane; width: 2; height: 2;');
                    entity7.setAttribute('material', 'side: double; color: black; opacity: 0');
                    entity7.setAttribute('position', '1.5 0 0.1');
                    entity7.setAttribute('text', 'align: center; value: XR Audio Player\n\nv. 0.0.3; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt');
                    entity7.setAttribute('animation__glisten','property: material.opacity; delay: 3500; dur: 2500; easing: linear; to: 0.5;');
                    
                    /*var animation12 = document.createElement('a-animation');
                    
                    animation12.setAttribute('attribute', 'material.opacity');
                    animation12.setAttribute('delay', '3500');
                    animation12.setAttribute('dur', '2500');
                    animation12.setAttribute('easing', 'linear');
                    animation12.setAttribute('fill', 'forwards');
                    animation12.setAttribute('to', '0.5');

                    entity7.appendChild(animation12);*/
                    entity5.appendChild(entity6);
                    entity5.appendChild(entity7);
                    
                    ////
                    
                    var entity8 = document.createElement('a-entity');
                    
                    entity8.setAttribute('id',"audio-cover-artwork");
                    entity8.setAttribute('rotation',"0 0 0");
                    entity8.setAttribute('scale','0.1 0.1 0.1');
                    entity8.setAttribute('position', '0 2 -2');
                    entity8.setAttribute('geometry',"primitive: plane; width: 1; height: 1;"); entity8.setAttribute('material',"side: double; src: ;");
                    entity8.setAttribute('animation__scale','property: scale; delay: 3500; dur: 2500; easing: linear; to: 3 3 3');
                    entity8.setAttribute('animation__rotate','property: rotation; dur: 20000; easing: linear; to: 0 360 0; loop: true;');
                    
                    /*var animation13 = document.createElement('a-animation')
                    
                    animation13.setAttribute('attribute',"rotation");
                    animation13.setAttribute('dur',"20000");
                    animation13.setAttribute('easing',"linear");
                    animation13.setAttribute('fill',"forwards");
                    animation13.setAttribute('to',"0 360 0");
                    animation13.setAttribute('repeat',"indefinite");
                    
                    var animation14 = document.createElement('a-animation');
                    
                    animation14.setAttribute('attribute',"scale");
                    animation14.setAttribute('delay', '3500');
                    animation14.setAttribute('dur', '2500');
                    animation14.setAttribute('easing', 'linear');
                    animation14.setAttribute('fill', 'forwards');
                    animation14.setAttribute('to', '3 3 3')
                    
                    entity8.appendChild(animation13);
                    entity8.appendChild(animation14);*/
                    
                    ////////////////////////
                    
                    var entity10 = document.createElement('a-entity');
                    entity10.setAttribute('position', '2 0 2');
                    entity10.setAttribute('rotation', '0 45 0');
                    
                    var entity11 = document.createElement('a-camera');
                    
                    entity11.setAttribute('look-controls', true);
                    entity11.setAttribute('wasd-controls', true);
                    entity11.setAttribute('userHeight', '1.8');
                    
                    entity10.appendChild(entity11);
                    //console.log(core.tether);
                    core.tether.appendChild(entity10);
                    core.tether.appendChild(entity0);
                    core.tether.appendChild(entity1);
                    core.tether.appendChild(entity2);
                    core.tether.appendChild(entity3);
                    core.tether.appendChild(entity4);
                    core.tether.appendChild(entity5);
                    core.tether.appendChild(entity8);
                    
                    core.assetsContainer = document.querySelector('.embedded-assets-container');
                    
                    for(var i=0; i<core.trackList.length; i++){
                        var imgAsset = document.createElement('img');
                        imgAsset.setAttribute('id', core.trackList[i].texture);
                        imgAsset.setAttribute('src', core.trackList[i].cover);
                        imgAsset.setAttribute('preload', true);
                        core.assetsContainer.appendChild(imgAsset);
                    }
                }
            }
        }

        this.view = 'scroll'; // scroll is the default, list is the secondary option, tertiary mode is the alternative AR or VR view

        this.XRSetting = 'xr'; // flat is default, ar is secondary, vr is tertiary
    }
};