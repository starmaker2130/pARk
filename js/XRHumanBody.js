function XRAudioPlayer(name, height, weight, tailorMeasurements){
    if(name==null||height==null||weight==null){
        throw new Error('Cannot initialize this component without a name, height, or weight. XR Human Body spec. v. 0.0.1');
    }
    else{
        var self = this;

        this.type ='xrhumanbody';
        this.socket = null;
        this.identity = name;
        this.height = height;
        this.weight = weight;
        
        console.log(`new xr componenet generated: \n ------------------ \n XRHumanBody v. 0.0.1 \n type: ${self.type} \n outgoing socket? ${(self.socket!=null)} \n objId: ${self.identity} \n height: ${self.height} \n weight: ${self.weight}\n ------------------`);
        
        this.spawn = function(){
            self.socket = io.connect(location.host);
            //self.socket.emit('spawnXRAudioPlaylist', {status: true});
        };

        this.build = function(){
            console.log(`[xrhumanbody] Build body model ${self.identity} from mark up.`);
            self.application.core.tether = document.querySelector('.embedded-scene-container');
            //console.log(self.application.core.tether);
            
            console.log(`[xrhumanbody] ${self.identity} tethered to DOM.`);
            self.application.core.build();
        };
        
        this.render = function(){
            console.log('new build function goes here');
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
                    'xrhumanbody': function(environment){
                        var renderView = self;

                        if(renderView!=null&&environment!=null){
                            environment.application.core.childList[self.identity] = renderView;

                            console.log('attaching xrhumanbody component to environment.')

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

                            <a-entity class='panel-container' geometry="primitive: plane; width: 2; height: 2;" rotation='0 0 0' material='side: double; color: aquamarine;' position='0 1 -2.5'>
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

                            <a-entity class='title-container' geometry='primitive: plane; width: 3; height: 0.75;' position='0 4 -2' material='side: double; color: white; opacity: 0' >
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

                            <a-entity id="audio-cover-artwork" rotation="0 0 0" scale='0.1 0.1 0.1' position='0 2 -2' geometry="primitive: plane; width: 1; height: 1;" material="side: double; src: ;">
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
                                               /*{
                                                    name: '.song-meta-data-panel-animation-0',
                                                    order: 1,
                                                    elementType: 'a-animation',
                                                    attribute: "rotation",
                                                    begin: 'launchPlayers',
                                                    dur: "2000",
                                                    fill: "forwards",
                                                    to: "-110 -180 180"
                                                },/*
                                                {
                                                    name: '.song-meta-data-panel-animation-1',
                                                    order: 1,
                                                    elementType: 'a-animation',
                                                    attribute: "position",
                                                    delay: '3500',
                                                    dur: "2000",
                                                    fill: "forwards",
                                                    to: "0 0 -0.5"
                                                },*/
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
                                              /*  {
                                                    name: '.track-list-panel-animation-0',
                                                    order: 1,
                                                    elementType: 'a-animation',
                                                    attribute: "rotation",
                                                    delay: '3500',
                                                    dur: "2000",
                                                    fill: "forwards",
                                                    to: "290 90 0",
                                                },
                                                {
                                                    name: '.track-list-panel-animation-1',
                                                    order: 1,
                                                    elementType: 'a-animation',
                                                    attribute: "position",
                                                    delay: '3500',
                                                    dur: "2000",
                                                    fill: "forwards",
                                                    to: "2 0 -2.5",
                                                },*/
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
                                              /*  {
                                                    name: '.container-animation-0',
                                                    order: 1,
                                                    elementType: 'a-animation',
                                                    attribute:"rotation",
                                                    delay: '3500',
                                                    dur: "2000",
                                                    fill: "forwards",
                                                    to: "-110 90 180"
                                                },
                                                {
                                                    name: '.container-animation-1',
                                                    order: 1,
                                                    elementType: 'a-animation',
                                                    attribute: "position",
                                                    delay: '3500',
                                                    dur: "2000",
                                                    fill: "forwards",
                                                    to: "-2 0 -2.5",
                                                },*/
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
                                               /* {
                                                    name: '.container-animation-0',
                                                    order: 1,
                                                    elementType: 'a-animation',
                                                    attribute: "rotation",
                                                    delay: '3500',
                                                    dur: "2000",
                                                    fill: "forwards",
                                                    to: "-110 0 0",
                                                },
                                                {
                                                    name: '.container-animation-1',
                                                    order: 1,
                                                    elementType: 'a-animation',
                                                    attribute: "position",
                                                    delay: '3500',
                                                    dur: "2000",
                                                    fill: "forwards",
                                                    to: "0 0 -4.5"
                                                }*/
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
                                                /*{
                                                    name: '.song-title-container-animation-0',
                                                    order: 1,
                                                    elementType: 'a-animation', 
                                                    attribute: "material.opacity",
                                                    delay:"3500",
                                                    dur:'2500',
                                                    easing:"linear",
                                                    fill:"forwards",
                                                    to: "0.5"
                                                },*/
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
                                                       /* {
                                                            name: '.title-container-animation-0',
                                                            order: 2,
                                                            elementType: 'a-animation',
                                                            attribute:"material.opacity",
                                                            delay:"3500",
                                                            dur:'2500',
                                                            easing:"linear",
                                                            fill:"forwards",
                                                            to:"0.5"
                                                        }*/
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
                                               /* {
                                                    name: '.hov-company-panel-animation-0',
                                                    order: 1,
                                                    elementType: 'a-animation',
                                                    attribute:"material.opacity",
                                                    delay: "3500",
                                                    dur: '2500',
                                                    easing: "linear",
                                                    fill: "forwards",
                                                    to: "0.5"
                                                },*/
                                                {
                                                    name: '.hov-company-panel',
                                                    order: 1,
                                                    elementType: 'a-entity',
                                                    geometry:'primitive: plane; width: 2; height: 2;',
                                                    position:'-1.5 0 0.1',
                                                    material:'side: double; color: black; opacity: 0.5', //opacity: 0
                                                    text:'align: center; value: House of Venus\n\n (c) 2019; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt',
                                                    children: [
                                                        /*{
                                                            name: '.company-panel-animation-0',
                                                            order: 2,
                                                            elementType: 'a-animation',
                                                            attribute: "material.opacity",
                                                            delay:"3500",
                                                            dur:'2500',
                                                            easing:"linear",
                                                            fill:"forwards",
                                                            to:"0.5"
                                                        }*/
                                                    ]
                                                },
                                                {
                                                    name: '.xraudioplayer-version-panel',
                                                    order: 0,
                                                    elementType: 'a-entity',
                                                    geometry:'primitive: plane; width: 2; height: 2;',
                                                    position:'1.5 0 0.1',
                                                    material:'side: double; color: black; opacity: 0.5', //opacity: 0
                                                    text:'align: center; value: XR Audio Player\n\nv. 0.0.3; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt',
                                                    children:[
                                                     /*   {
                                                            name: '.version-panel-animation-0',
                                                            order: 1,
                                                            elementType: 'a-animation',
                                                            attribute: "material.opacity",
                                                            delay:"3500",
                                                            dur:'2500',
                                                            easing:"linear",
                                                            fill:"forwards",
                                                            to:"0.5"
                                                        }*/
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
                                          /*      {
                                                    name: '.cover-artwork-animation-0',
                                                    order: 1,
                                                    elementType: 'a-animation',
                                                    attribute:"rotation",
                                                    dur:"20000",
                                                    easing:"linear",
                                                    fill:"forwards",
                                                    to: "0 360 0",
                                                    repeat:"indefinite"
                                                },
                                                {
                                                    name: '.cover-artwork-animation-1',
                                                    order: 1,
                                                    elementType: 'a-animation',
                                                    attribute:"scale",
                                                    delay:'3500',
                                                    dur:"2500",
                                                    easing:"linear",
                                                    fill:"forwards",
                                                    to: "3 3 3"
                                                }*/
                                            ]
                                        },
                                        /*{
                                            name:'a-entity',
                                            geometry:"primitive: plane; width: 100; height: 100;",
                                            rotation:'-90 0 0',
                                            material:'src: #floor-texture; repeat: 100 100; opacity: 1.0;',
                                            children: [
                                                {
                                                    name: 'a-animation',
                                                    attribute:'material.opacity',
                                                    delay:'3000',
                                                    dur:'2000',
                                                    fill:'forwards',
                                                    to:'0'
                                                } 
                                             ]
                                        }*/
                                    ]
                                }
                            });
                        }
                        else{
                            console.log('execute handler for xrhumanbody object');
                        }
                    }
                },
                createPointer: function(target){

                },
                buildElement: function(element){

                }
            },
            defaultAnimation: {

            },
            core: {
                assetsContainer: null,
                index: -1,
                layers: {
                    head: {
                        
                    },
                    torso: {
                        
                    },
                    hands: {
                        
                    },
                    legs: {
                        
                    },
                    feet: {
                        
                    }
                },
                spawn: function(){
                    console.log('only available in npm package for security reasons');
                },
                source: null,
                stream: function(){
                    var core = self.application.core;

                },
                tether: null,
                makeTextureLoader: function(index){
                    var target = index;
                    document.querySelector('#embedded-assets-container').append(`<img id='${target.texture}' src='${target.coverURL}' preload='true' />`);
                },
                build: function(){
                    var core = self.application.core;
                    
                  
                    ////////////////////////
                    
                    var entity10 = document.createElement('a-entity');
                    entity10.setAttribute('position', '2 0 2');
                    entity10.setAttribute('rotation', '0 45 0');
                    
                    var entity11 = document.createElement('a-camera');
                    
                    entity11.setAttribute('look-controls', true);
                    entity11.setAttribute('wasd-controls', true);
                    entity11.setAttribute('userHeight', '1.8');
                    
                    entity10.appendChild(entity11);
                    console.log(core.tether);
                    
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
        };

        this.view = 'scroll'; // scroll is the default, list is the secondary option, tertiary mode is the alternative AR or VR view

        this.XRSetting = 'xr'; // flat is default, ar is secondary, vr is tertiary
    }
};