/*
*   XR PANEL | HOUSE OF VENUS PUBLIC AUGMENTED REALITY KINECTOME
*   
*   author: Patrice-Morgan Ongoly | @starmaker2130 | @ceo.hov
*   title: XR Panel
*   version: 0.1.0
*   last modified: Sunday, February 3, 2019 11:06:13 UTC-05:00:00
*   description: a frame for rendering human bodies in decentralized immersive applications with handlers for outfits 
*       (XRBodyLayers) as described in the pARk specification v. 0.2.0
*
*/ 

function XRPanel(name, contentAddress, hashLife){
    var self = this;
    if(name==null){
        throw new Error('Cannot initialize this component without a name or contentAddress. XR Menu Button spec. v. 0.0.1');
    }
    else{
        this.type ='xrpanel';
        this.socket = null;
        this.identity = name;
        this.contentAddress = contentAddress || null;
        
        this.spawn = function(){
            self.socket = io.connect(location.host);
        };
        
        this.scale = function(targetX, targetY){
            self.application.core.scale(targetX, targetY);
            return true;
        }
        
        this.setRotation = function(target){
            console.log(`rotate ${self.identity} to ${target}`);
            self.application.core.setRotation(target);
            return true;
        }
        
        this.build = function(){
            console.log(`[xrpanel] Build menu button ${self.identity} from mark up.`);
            self.application.core.tether = document.querySelector('.embedded-scene-container');
            
            console.log(`[xrpanel] ${self.identity} tethered to DOM.`);
            self.application.core.build();
        };
        
        this.render = function(){
            console.log('new build function goes here');
        }
        
        this.stream = function(){
            self.application.core.stream();
        };

        this.addDestination = function(preview){
            self.application.core.destinations.add(preview);
            return true;
        };
        
        this.setPhysicsEngine = function(target){
            self.application.core.physics.engine(target);
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
                    'xrpanel': function(environment, location){                        
                        var componentArray = [];
                        var panelComponent, panelAssets;
                        var objectLocation = location || null;

                        if(self!=null&&environment!=null){
                            environment.application.core.childList[self.identity] = self;

                            /*console.log(`attaching xrmenubutton ${self.identity} component to environment.`)
                            console.log(self);
                            console.log('loading asset dependencies into experience asset container...');*/
                            // load all of the layers associated with the current model
                                
                            var panelTexture = self.application.core.destinations.src;
                            console.log(panelTexture.src);
                            
                            panelAssets = {
                                name: `#${self.identity}-panel-texture`,
                                elementType: 'img',
                                src: `${panelTexture.src}`,
                                preload: 'true'
                            };
                            
                            var object = self.application.core.physics.object;
                            if(objectLocation==null){
                                objectLocation = object.position;
                            }
                            
                            if(self.application.core.destinations.src.gif!=null&&self.application.core.destinations.src.gif==true){
                                panelComponent = {
                                    name: `#${self.identity}-panel`,
                                    class: `.main-menu-panel`,
                                    order: 1,
                                    elementType: 'a-entity',
                                    geometry: `primitive: ${object.geometry.primitive}; width: ${object.geometry.width}; height: ${object.geometry.height};`,
                                    rotation: `${object.rotation}`,
                                    /*width: `${object.geometry.width};`,
                                    height: `${object.geometry.height};`,*/
                                    material: `shader:gif;src: url(${panelTexture.src});side: double; opacity: 0.9;`,
                                    /*gif: '',*/
                                    position: objectLocation,
                                    children:[]
                                };
                                
                                self.application.core.gifsPresent = true;
                                console.log('GIF PRESENT');
                            }
                            else{
                                panelComponent = {
                                    name: `#${self.identity}-panel`,
                                    class: `.main-menu-panel`,
                                    order: 1,
                                    elementType: 'a-entity',
                                    geometry: `primitive: ${object.geometry.primitive}; width: ${object.geometry.width}; height: ${object.geometry.height};`,
                                    rotation: `${object.rotation}`,
                                    material: `src: #${self.identity}-panel-texture; side: double; color: white; opacity: 0.95;`,
                                    position: objectLocation,
                                    children:[]
                                };

                            }
                            
                            self.application.core.physics.object.pointers.push(`#${self.identity}-panel`);
                            self.application.core.physics.object.position = objectLocation;

                            componentArray.push(panelComponent);
                            
                            /*console.log(`we have added the panel ${self.identity} to the environment at ${objectLocation} \n COMPONENT ARRAY`);
                            console.log(componentArray);*/

                            environment.application.renderer.buildElement.push(panelAssets);

                            environment.application.core.experience.push({
                                name: '.xrpanel',
                                order: 0,
                                elementType: 'xrpanel',
                                build: {
                                    raw: `<a-entity geometry="primitive: plane; width: 100; height: 100;" rotation='-90 0 0' material='src: #floor-texture; repeat: 100 100; opacity: 1.0;'>
                                <a-animation attribute='material.opacity'
                                             delay='3000',
                                             dur='2000'
                                             fill='forwards'
                                             to='0'></a-animation>
                            </a-entity>`,
                                    components: componentArray
                                }
                            });
                        }
                        else{
                            console.log('execute handler for xrpanel object');
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
                physics: {
                    convertPositionToMatrix: function(position){
                        
                    },
                    updatePosition: function(change){
                        var currentPosition = self.application.core.physics.object.position;
                        var currentMatrix = [];
                        var positionMatrix = [];
                        var space = change.indexOf(' ');
                        var space2 = currentPosition.indexOf(' ');
                        var positionValue, currentValue;
                        
                        while(space>-1){
                            positionValue = change.substring(0, space);
                            positionValue = parseFloat(positionValue);
                            positionMatrix.push(positionValue);
                            change = change.substring(space+1);
                            space = change.indexOf(' ');
                        }
                        
                        positionValue = parseFloat(change);
                        positionMatrix.push(positionValue);
                        console.log(positionMatrix);
                                                
                        while(space2>-1){
                            currentValue = currentPosition.substring(0, space2);
                            currentValue = parseFloat(currentValue);
                            currentMatrix.push(currentValue);
                            currentPosition = currentPosition.substring(space2+1);
                            space2 = currentPosition.indexOf(' ');
                        }
                        
                        currentValue = parseFloat(currentPosition);
                        currentMatrix.push(currentValue);
                        console.log(currentMatrix);
                        
                        currentMatrix[0]+=positionMatrix[0]
                        currentMatrix[1]+=positionMatrix[1]
                        currentMatrix[2]+=positionMatrix[2]
                        
                        var newPosition = currentMatrix[0]+' '+currentMatrix[1]+' '+currentMatrix[2];
                        self.application.core.physics.object.position = newPosition;
                        
                        return newPosition;
                    },
                    updateRotation: function(change){
                        var currentRotation = self.application.core.physics.object.rotation;
                        var currentMatrix = [];
                        var rotationMatrix = [];
                        var space = change.indexOf(' ');
                        var space2 = currentRotation.indexOf(' ');
                        var rotationValue, currentValue;
                        
                        while(space>-1){
                            rotationValue = change.substring(0, space);
                            rotationValue = parseFloat(rotationValue);
                            rotationMatrix.push(rotationValue);
                            change = change.substring(space+1);
                            space = change.indexOf(' ');
                        }
                        
                        rotationValue = parseFloat(change);
                        rotationMatrix.push(rotationValue);
                        console.log(rotationMatrix);
                                                
                        while(space2>-1){
                            currentValue = currentRotation.substring(0, space2);
                            currentValue = parseFloat(currentValue);
                            currentMatrix.push(currentValue);
                            currentRotation = currentRotation.substring(space2+1);
                            space2 = currentRotation.indexOf(' ');
                        }
                        
                        currentValue = parseFloat(currentRotation);
                        currentMatrix.push(currentValue);
                        console.log(currentMatrix);
                        
                        currentMatrix[0]+=rotationMatrix[0]
                        currentMatrix[1]+=rotationMatrix[1]
                        currentMatrix[2]+=rotationMatrix[2]
                        
                        var newRotation = currentMatrix[0]+' '+currentMatrix[1]+' '+currentMatrix[2];
                        self.application.core.physics.object.rotation = newRotation;
                        
                        return newRotation;
                    },
                    engine: function(target){
                        var environment;
                        var leftDpadButton = document.createElement('div');
                        var rightDpadButton = document.createElement('div');
                        var upDpadButton = document.createElement('div');
                        var downDpadButton = document.createElement('div');
                        
                        var rotateClockwiseButton = document.createElement('div');
                        var rotateCounterclockwiseButton = document.createElement('div');
                        
                        var model = self.application.core.physics.object.pointers;
                        var physics = self.application.core.physics;
                        
                        if(target==0){
                            environment = document.querySelector('.main-app-container');
                            leftDpadButton.innerHTML = '◀'
                            leftDpadButton.setAttribute('id', 'left-dpad-button');
                            leftDpadButton.setAttribute('class', 'dpad-button');
                            leftDpadButton.classList.add = 'dpad-button'
                            
                            leftDpadButton.addEventListener('click', function(){
                                console.log(`move model ${self.identity} left`);
                                
                                for(var i=0; i<model.length; i++){
                                    //console.log(model[i]); '-4 1 0';
                                    var newPosition = physics.updatePosition('-0.25 0 0');
                                    document.querySelector(model[i]).setAttribute('position', newPosition);
                                }
                                //#${layer.name}-obj-model-${i}-${j}
                            });

                            rightDpadButton.innerHTML = '▶'
                            rightDpadButton.setAttribute('id', 'right-dpad-button');
                            rightDpadButton.setAttribute('class', 'dpad-button');
                            rightDpadButton.classList.add = 'dpad-button';
                            
                            rightDpadButton.addEventListener('click', function(){
                                console.log(`move model ${self.identity} right`);
                                
                                for(var i=0; i<model.length; i++){
                                    //var newPosition = '4 1 0';
                                    //console.log(model[i]);
                                    var newPosition = physics.updatePosition('0.25 0 0');
                                    document.querySelector(model[i]).setAttribute('position', newPosition);
                                }
                            });
                            
                            upDpadButton.innerHTML = '▲'
                            upDpadButton.setAttribute('id', 'up-dpad-button');
                            upDpadButton.setAttribute('class', 'dpad-button');
                            upDpadButton.classList.add = 'dpad-button';
                            
                            upDpadButton.addEventListener('click', function(){
                                console.log(`move model ${self.identity} forward`);
                                
                                for(var i=0; i<model.length; i++){
                                    //var newPosition = '0 1 -4';
                                    //console.log(model[i]);
                                    var newPosition = physics.updatePosition('0 0 -0.25');
                                    document.querySelector(model[i]).setAttribute('position', newPosition);
                                }
                            });
                            
                            downDpadButton.innerHTML = '▼'
                            downDpadButton.setAttribute('id', 'down-dpad-button');
                            downDpadButton.setAttribute('class', 'dpad-button');
                            downDpadButton.classList.add = 'dpad-button';
                            
                            downDpadButton.addEventListener('click', function(){
                                console.log(`move model ${self.identity} back`);
                                
                                for(var i=0; i<model.length; i++){
                                    //var newPosition = '0 1 4';
                                    //console.log(model[i]);
                                    var newPosition = physics.updatePosition('0 0 0.25');
                                    document.querySelector(model[i]).setAttribute('position', newPosition);
                                }
                            });
                            
                            rotateClockwiseButton.innerHTML = '&sol;';
                            rotateClockwiseButton.setAttribute('id', 'rotate-clockwise-button');
                            rotateClockwiseButton.setAttribute('class', 'rotate-button');
                            rotateClockwiseButton.classList.add = 'rotate-button';
                            rotateClockwiseButton.addEventListener('click', function(){
                                console.log(`rotate model ${self.identity} clockwise`);
                                
                                for(var i=0; i<model.length; i++){
                                    //var newPosition = '0 1 4';
                                    //console.log(model[i]);
                                    var newRotation = physics.updateRotation('0 0 -5');
                                    document.querySelector(model[i]).setAttribute('rotation', newRotation);
                                }
                            });
                            
                            rotateCounterclockwiseButton.innerHTML = '&bsol;';
                            rotateCounterclockwiseButton.setAttribute('id', 'rotate-counterclockwise-button');
                            rotateCounterclockwiseButton.setAttribute('class', 'rotate-button');
                            rotateCounterclockwiseButton.classList.add = 'rotate-button';
                            rotateCounterclockwiseButton.addEventListener('click', function(){
                                console.log(`rotate model ${self.identity} counterclockwise`);
                                
                                for(var i=0; i<model.length; i++){
                                    //var newPosition = '0 1 4';
                                    //console.log(model[i]);
                                    var newRotation = physics.updateRotation('0 0 5');
                                    document.querySelector(model[i]).setAttribute('rotation', newRotation);
                                }
                            });
                            
                            environment.appendChild(leftDpadButton);
                            environment.appendChild(rightDpadButton);
                            environment.appendChild(upDpadButton);
                            environment.appendChild(downDpadButton);
                            
                            environment.appendChild(rotateClockwiseButton);
                            environment.appendChild(rotateCounterclockwiseButton);
                        }
                    },
                    object: {
                        position: null,
                        rotation: '0 0 0',
                        pointers: [],
                        geometry: {
                            width: 1,
                            height: 1,
                            primitive: 'plane'
                        }
                    }
                },
                gifsPresent: false,
                assetsContainer: null,
                index: -1,
                destinations: {
                    src: null,
                    add: function(childObject){ // {name: String, src: String }
                        self.application.core.destinations.src = childObject;
                        return true;
                    }
                },
                scale: function(targetX, targetY){
                    if(typeof(targetX)=='number'&&typeof(targetY)=='number'){
                        console.log('SCALING TARGET');
                        self.application.core.physics.object.geometry.width = targetX;
                        self.application.core.physics.object.geometry.height = targetY;
                        console.log(`scale to ${targetX}, ${targetY}`);
                        //document.querySelector(`#${self.identity}-button`).setAttribute('geometry.radius', target);
                    }else{
                        throw new Error('INVALID TYPE. Cannot scale panel to non-number target.');
                    }
                },
                setRotation: function(target){
                    if(typeof(target)=='string'){
                        console.log('ROTATING TARGET');
                        self.application.core.physics.object.rotation = target;
                        console.log(target);
                        //document.querySelector(`#${self.identity}-button`).setAttribute('geometry.radius', target);
                    }else{
                        throw new Error('INVALID TYPE --> FORMAT. Cannot rotate panel to specified target.');
                    }
                },
                spawn: function(){
                    console.log('only available in npm package for security reasons');
                },
                source: null,
                stream: function(){
                    var core = self.application.core;
                    
                    // stream all gifs if any
                    if(self.application.core.gifsPresent){
                        console.log('streaming gifs!');
                        document.querySelector(`#${self.identity}-panel`).play();
                    }
                    
                },
                tether: null,
                makeTextureLoader: function(index){
                    var target = index;
                    document.querySelector('#embedded-assets-container').append(`<img id='${target.texture}' src='${target.coverURL}' preload='true' />`);
                },
                traverseTextureMatrix: function(){
                    var core = self.application.core;
                    
                    for(var i=0; i<core.destinations.length; i++){
                        if(core.destinations[i]!=null){
                            // other funciontality goes here
                            console.log(core.destinations[i]);
                        }
                    }
                },
                build: function(){
                    var core = self.application.core;
                    
                    if(core.destinations.matrix[0].length>0){
                        core.traverseLayerMatrix();
                    }
                    ////////////////////////
                    
                    var entity10 = document.createElement('a-entity');
                    entity10.setAttribute('position', '2 0 2');
                    entity10.setAttribute('rotation', '0 -45 0');
                    
                    var entity11 = document.createElement('a-camera');
                    
                    entity11.setAttribute('look-controls', true);
                    entity11.setAttribute('wasd-controls', true);
                    entity11.setAttribute('userHeight', '1.8');
                    
                    entity10.appendChild(entity11);
                    console.log(core.tether);
                    
                    core.assetsContainer = document.querySelector('.embedded-assets-container');
                }
            }
        };

        this.view = 'scroll'; // scroll is the default, list is the secondary option, tertiary mode is the alternative AR or VR view

        this.XRSetting = 'xr'; // flat is default, ar is secondary, vr is tertiary
        
        if(contentAddress!=null){
            self.addDestination(contentAddress);
        }
        console.log(`\nNew XR Component Generated: \n ------------------ \n XRPanel v. 0.0.1 \n type: ${self.type} \n outgoing socket? ${(self.socket!=null)} \n objId: ${self.identity} \n ------------------`);
    }
}