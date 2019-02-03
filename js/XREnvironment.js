/*
*   XR ENVIRONMENT | HOUSE OF VENUS PUBLIC AUGMENTED REALITY KINECTOME
*   
*   author: Patrice-Morgan Ongoly | @starmaker2130 | @ceo.hov
*   title: XR Environment
*   version: 0.19.0
*   last modified: Sunday, February 3, 2019 10:09:13 UTC-05:00:00
*   description: base immersive reality experience class that contains all the logic for immersive hyper reality 
*       applications as described in the pARk specification v. 0.2.0
*
*/ 

function XREnvironment(height, width, length, time){
    var self = this;
    
    this.height = height || 100;
    this.width = width || 100;
    this.length = length || 100;
    this.time = time || Infinity;
    
    this.type = 'xrenvironment';
    
    this.render = function(){
        self.application.core.render();
    }
    
    this.add = function(childObject, position){
        var objType = childObject.type;
        var location = position || null;
        
        if(self.application.renderer.dictionary[objType]!=undefined){
           // self.application.renderer.dictionary[objType](childObject);
            console.log(`rendering component type ${objType} in environment space...`);
            childObject.application.renderer.dictionary[objType](self, location);
        }
        else{
            console.log('unregistered component model added to environment.');
        }
        
        //self.pointers.elements.push(``)
        return Object.keys(self.application.core.childList).length;
    }
    
    this.stream = function(dataType, dataName, dataTarget){
        var type = dataType || null;
        var targetName = dataName || null;
        var target = dataTarget || null;
        self.application.core.stream(type, targetName, target);
    }
    
    this.application =  {
        renderer: {
            types: [
                'vr',
                'ar',
                'xr',
                'flat'
            ],
            dictionary: {
                'xraudio': function(renderView){
                    if(renderView!=null){
                        self.application.core.childList[renderView.identity] = renderView;
                        
                        console.log('attaching xraudio component to environment.');
                        
                        console.log('loading asset dependencies into experience asset container...');
                        
                        for(var i=0; i<renderView.application.core.trackList.length; i++){
                            let track = renderView.application.core.trackList[i];
                            self.application.renderer.buildElement.push({
                                name: `#${track.texture}`,
                                elementType: 'img',
                                src: `${track.cover}`,
                                preload: 'true'
                            });
                        }
                        
                        self.application.core.experience.push({
                            name: '.xraudioplayer',
                            order: 0,
                            elementType: 'xraudio',
                            build: {
                                raw: `<a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='0 -180 180' material='side: double; color: red;' position='0  1 -1.5'>
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
                            </a-animation>                            <a-entity geometry='primitive: plane; width: 2; height: 2;' position='-1.5 0 0.1' material='side: double; color: black; opacity: 0'  text='align: center; value: House of Venus\n\n (c) 2018; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt'>
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
                        console.log('execute handler for xraudioplayer object');
                    }
                },
                'xrhumanbody': function(renderView){
                    if(renderView){
                        
                    }
                    else{
                        console.log('execute handler for xrhumanbody object');
                    }
                },
                'xrautomobile': function(renderView){
                    if(renderView){
                        
                    }
                    else{
                        console.log('execute handler for xrautomobile object');
                    }
                }
            },
            createPointer: function(target){

            },
            buildElement: [
                
            ]
        },
        core: {
            pointers : {
                renderHistory: 0,
                experienceContainer: null,
                assetsContainer: null,
                elements: [],
                stream: {
                    audio: null,
                    video: null
                }
            },
            buildXRComponent: function(element, target){
                var key = element;
                var XRComponent = target;
                
                if(key.name.charAt(0)=='.'){
                        XRComponent.setAttribute('class', key.name.substring(1));
                    }
                    if(key.name.charAt(0)=='#'){
                        XRComponent.setAttribute('id', key.name.substring(1));
                    }

                    var componentPointer = document.querySelector(key.name);
                    //console.log(componentPointer);

                    if(key.elementType=='a-animation'){
                        componentPointer.setAttribute('attribute', key.attribute);
                        componentPointer.setAttribute('delay', key.delay);
                        componentPointer.setAttribute('dur', key.dur);
                        componentPointer.setAttribute('fill', key.fill);
                        componentPointer.setAttribute('to', key.to);
                    }
                    else if(key.elementType=='a-camera'){
                        componentPointer.setAttribute('position', key.position);
                        componentPointer.setAttribute('rotation', key.rotation);
                    }
                    else if(key.elementType=='a-sky'){
                        componentPointer.setAttribute('transparent', key.transparent);
                        componentPointer.setAttribute('opacity', key.opacity);
                    }
                    else if(key.elementType=='a-text'){
                        componentPointer.setAttribute('rotation', key.position);
                        componentPointer.setAttribute('rotation', key.rotation);
                        componentPointer.setAttribute('value', key.value);
                        componentPointer.setAttribute('font', key.font);
                        componentPointer.setAttribute('align', key.align);
                    }
                    else if(key.elementType=='a-obj-model'){
                        componentPointer.setAttribute('position', key.position);
                        componentPointer.setAttribute('rotation', key.rotation);
                        componentPointer.setAttribute('src', key.src);
                        componentPointer.setAttribute('mtl', key.mtl);
                    }
                    else{                    
                        componentPointer.setAttribute('geometry', key.geometry);
                        componentPointer.setAttribute('rotation', key.rotation);
                        componentPointer.setAttribute('material', key.material);
                        componentPointer.setAttribute('position', key.position);
                        if(key.text!=null){
                            componentPointer.setAttribute('text', key.text);
                        }
                    }

                    console.log(componentPointer);
                if(key.children!=null&&key.children.length>0){
                    console.log('this component has children!');
                    for(var child = 0; child<key.children.length; child++){
                        self.application.core.attachFrameToDOM(key.children[child], key.name);
                    }
                }
            },
            attachFrameToDOM: function(key, target){
                //console.log(key.elementType);
                //console.log(key);
                if(key.elementType=='xraudio'||key.elementType=='xrhumanbody'){ // first order aframe component
                    console.log(key);
                    var XRComponents = new Array(key.build.components.length);
                    for(var k=0; k<XRComponents.length; k++){
                        let currentComponent = key.build.components[k];
                        
                        if(currentComponent.order==0){
                            self.application.core.attachFrameToDOM(currentComponent);
                        }
                        else{
                            self.application.core.attachFrameToDOM(currentComponent, currentComponent.name);
                        }
                        
                        /*XRComponents[k] = document.createElement(currentComponent.elementType);
                        
                        self.application.core.pointers.experienceContainer.appendChild(XRComponents[k]);
                        
                        self.application.core.buildXRComponent(key, XRComponents[k]);*/
                    }
                }
                else{
                    var XRComponent = document.createElement(key.elementType);
                
                    if(target==null&&key.order==0){
                        self.application.core.pointers.experienceContainer.appendChild(XRComponent);
                    }
                    else{
                        console.log(target);
                        console.log(key);
                        document.querySelector(target).appendChild(XRComponent);
                    }

                    self.application.core.buildXRComponent(key, XRComponent);
                }
            },
            experience: [
                {
                    name: '.embedded-assets-container',
                    order: 0,
                    elementType: 'a-assets',
                    children: [
                        {
                            name: '#floor-texture',
                            elementType: 'img',
                            src: '../media/texture/grid_pattern.png',
                            preload: 'true'
                        }
                    ]
                },
                {
                    name: '#floor',
                    order: 0,
                    elementType: 'a-entity',
                    geometry: `primitive: plane; width: ${self.width}; height: ${self.height};`,
                    position: '0 0 0',
                    rotation: '-90 0 0',
                    material: `src: #floor-texture; repeat: ${self.width} ${self.height}; opacity: 1.0;`,
                    children: []
                },
                {
                    name: '#background-sky',
                    order: 0,
                    elementType: 'a-sky',
                    transparent: 'true',
                    opacity: '0',
                    children: []
                },
                {
                    name: '#main-user-camera',
                    order: 0,
                    elementType: 'a-camera',
                    position: '0 1.8 4',
                    userHeight: '1.8',
                    rotation: '0 0 0',
                    children: []
                }
            ],
            stream: function(type, name, src){
                if(type!=null){
                    if(type=='audio'){
                        if(self.application.core.pointers.stream.audio==null){
                            self.application.core.pointers.stream.audio = [];
                        }
                        console.log(`stream track ${src}`);
                        
                        self.application.core.pointers.stream.audio.push({
                            name: name,
                            track: src
                        });
                    }
                    else if(type=='video'){
                        if(self.application.core.pointers.stream.video==null){
                            self.application.core.pointers.stream.video = [];
                        }
                        
                        console.log(`stream video ${src}`);
                        
                        self.application.core.pointers.stream.video.push({
                            video: src
                        });
                    }
                }
                else{
                    if(self.application.core.pointers.stream.audio != null){
                        var audioStream = self.application.core.pointers.stream.audio[0].name;
                        self.application.core.childList[audioStream].stream();
                    }

                    if(self.application.core.pointers.stream.video != null){
                        var videoStream = self.application.core.pointers.stream.video[0].name;
                        self.application.core.childList[videoStream].stream();
                    }
                }
            },
            render : function(){
                //var self = this;
                var core = self.application.core;
                var experience = core.experience;
                var addOns = self.application.renderer.buildElement;
                
                console.log('rendering environment...');
                
                if(core.pointers.experienceContainer===null){
                    core.pointers.experienceContainer = document.querySelector('.embedded-scene-container');
                    console.log('connected to experience container.');
                }
                
                if(core.pointers.assetsContainer===null){
                    core.pointers.assetsContainer = document.querySelector('.embedded-assets-container');
                    
                    for(var i=0; i<experience[0].children.length; i++){
                        let current = experience[0].children[i];
                        let childElement = document.createElement(current.elementType);
                        
                        if(current.name.charAt(0)=='.'){
                            childElement.setAttribute('class', current.name.substring(1));
                        }
                        if(current.name.charAt(0)=='#'){
                            childElement.setAttribute('id', current.name.substring(1));
                        }
                        
                        childElement.setAttribute('src', current.src);
                        childElement.setAttribute('preload', current.preload);
                        
                        core.pointers.assetsContainer.appendChild(childElement);
                        
                    }
                    
                    for(var j=0; j<addOns.length; j++){// load assets into the assetcontainer from the build elements store
                        let childAddOn = addOns[j];
                        let addOnElement = document.createElement(childAddOn.elementType);
                        
                        if(childAddOn.name.charAt(0)=='.'){
                            addOnElement.setAttribute('class', childAddOn.name.substring(1));
                        }
                        if(childAddOn.name.charAt(0)=='#'){
                            addOnElement.setAttribute('id', childAddOn.name.substring(1));
                        }
                        
                        addOnElement.setAttribute('src', childAddOn.src);
                        addOnElement.setAttribute('preload', childAddOn.preload);
                        
                        core.pointers.assetsContainer.appendChild(addOnElement);
                        
                    }
                }
                
                if(core.pointers.renderHistory === 0){
                    Object.keys(experience).forEach(function(key, idx) {
                        var component = experience[key];
                        if(component.elementType!='a-assets'&&component.elementType!=null){
                            core.attachFrameToDOM(component);
                        }
                    });
                    core.pointers.renderHistory++;
                }                
            },
            childList: {}
        }
    };
}