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
        console.log(objType);
        
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
                    /* XR AUDIO PLAYER V. 0.4.0 */
                },
                'xrhumanbody': function(renderView){
                    /* XR HUMAN BODY V. 0.4.0 */
                },
                'xrautomobile': function(renderView){
                    /* XR AUTO MOBILE V. 0.4.0 */
                },
                'xrmenubutton': function(renderView){
                    /* XR MENU BUTTON V. 0.4.0 */
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
                    if(key.id!=null&&key.id.charAt(0)=='#'){
                        XRComponent.setAttribute('id', key.id.substring(1));
                    }
                }
                if(key.name.charAt(0)=='#'){
                    XRComponent.setAttribute('id', key.name.substring(1));
                    if(key.class!=null&&key.class.charAt(0)=='.'){
                        XRComponent.className = key.class.substring(1);
                    }
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
                if(key.elementType=='xraudio'||key.elementType=='xrhumanbody'||key.elementType=='xrmenubutton'){ // first order aframe component
                    console.log('--------------------- \n Attaching First Order component');
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
                        if(key.class=='.main-menu-button'){
                            target = '.embedded-scene-container';
                        }
                        console.log(`TARGET: ${target}`);
                        console.log(`KEY :`);
                        console.log(key.elementType);
                        console.log(XRComponent);
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