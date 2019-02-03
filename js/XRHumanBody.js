/*
*   XR HUMAN BODY | HOUSE OF VENUS PUBLIC AUGMENTED REALITY KINECTOME
*   
*   author: Patrice-Morgan Ongoly | @starmaker2130 | @ceo.hov
*   title: XR Human Body
*   version: 0.1.0
*   last modified: Sunday, February 3, 2019 11:06:13 UTC-05:00:00
*   description: a frame for rendering human bodies in decentralized immersive applications with handlers for outfits 
*       (XRBodyLayers) as described in the pARk specification v. 0.2.0
*
*/ 

function XRHumanBody(name, height, weight, tailorMeasurements){
    var self = this;
    if(name==null||height==null||weight==null){
        throw new Error('Cannot initialize this component without a name, height, or weight. XR Human Body spec. v. 0.0.1');
    }
    else{
        this.type ='xrhumanbody';
        this.socket = null;
        this.identity = name;
        this.height = height;
        this.weight = weight;
        
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

        this.addLayer = function(data){
            var core = self.application.core;
            var coreMatrix = core.layers.matrix;
            console.log('Added layer to core:');
            console.log('------');
            console.log(data);
            console.log('------');
            var layer = data;

            if(data.type=='xrbodylayer'){
                if(coreMatrix[0].length==coreMatrix[1].length&&coreMatrix[0].length==coreMatrix[2].length&&coreMatrix[0].length==coreMatrix[3].length&&coreMatrix[0].length==coreMatrix[4].length&&coreMatrix[0].length==0){
                    console.log('first layer on body!');
                }
                else{
                    console.log('secondary layer.');
                }
                for(var i=0;i<layer.matrix.length; i++){
                    coreMatrix[i].push(layer.matrix[i]);
                }
            }
            else{
                throw new Error('Cannot add a non XRBodyLayer object as a layer to an XRHumanBody. If attempting to add a JSON formatted object wrap it as an XRBodyLayer then try again.');
            }
            
            core.layers.matrix = coreMatrix;
            return core.layers.matrix;
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
                    'xrhumanbody': function(environment, location){
                        var renderView = self;
                        var componentArray = [];
                        var layerComponent;
                        var objectLocation = location || null;

                        if(renderView!=null&&environment!=null){
                            environment.application.core.childList[self.identity] = renderView;

                            console.log('attaching xrhumanbody component to environment.')

                            console.log('loading asset dependencies into experience asset container...');
                            // load all of the layers associated with the current model
                            for(var i=0; i<renderView.application.core.layers.matrix.length; i++){
                                console.log(renderView.application.core.layers.matrix[i]);
                                for(var j=0; j<renderView.application.core.layers.matrix[i].length; j++){
                                    let layer = renderView.application.core.layers.matrix[i][j];
                                    
                                    if(layer.name!=null&&layer.name!=undefined){
                                        console.log(`-----------------\n Added layer ${layer.name}.`);
                                        console.log(layer.obj);
                                        console.log(layer.mtl);
                                        layerAssets = {
                                            obj: {
                                                name: `#${layer.name}-obj`,
                                                elementType: 'a-asset-item',
                                                src: `${layer.obj}`,
                                                preload: 'true'
                                            },
                                            mtl: {
                                                name: `#${layer.name}-mtl`,
                                                elementType: 'a-asset-item',
                                                src: `${layer.mtl}`,
                                                preload: 'true'
                                            }
                                        };
                                        
                                        if(objectLocation==null){
                                            objectLocation = '0 1 0';
                                        }
                                        
                                        layerComponent = {
                                            name: `#${layer.name}-obj-model`,
                                            order: 0,
                                            elementType: 'a-obj-model',
                                            src: `#${layer.name}-obj`,
                                            mtl: `#${layer.name}-mtl`,
                                            rotation: '-90 0 0',
                                            position: objectLocation
                                        };
                                       
                                        componentArray.push(layerComponent);
                                        
                                        environment.application.renderer.buildElement.push(layerAssets.obj);
                                        environment.application.renderer.buildElement.push(layerAssets.mtl);
                                    }
                                }
                            }

                            environment.application.core.experience.push({
                                name: '.xrhumanbody',
                                order: 0,
                                elementType: 'xrhumanbody',
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
                    matrix: [
                        [],
                        [],
                        [],
                        [],
                        [],
                    ]
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
                traverseLayerMatrix: function(){
                    var core = self.application.core;
                    
                    for(var i=0; i<core.layers.matrix.length; i++){
                        for(var j=0; j<core.layers.matrix[i].length; j++){
                            if(core.layers.matrix[i][j]!=null){
                                var layer = core.layers.matrix[i][j];
                                var imgAsset = document.createElement('img');
                                imgAsset.setAttribute('id', core.trackList[i].texture);
                                imgAsset.setAttribute('src', core.trackList[i].cover);
                                imgAsset.setAttribute('preload', true);
                                core.assetsContainer.appendChild(imgAsset);
                            }
                        }
                        
                    }
                },
                build: function(){
                    var core = self.application.core;
                    
                    if(core.layers.matrix[0].length>0){
                        core.traverseLayerMatrix();
                    }
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
                }
            }
        };

        this.view = 'scroll'; // scroll is the default, list is the secondary option, tertiary mode is the alternative AR or VR view

        this.XRSetting = 'xr'; // flat is default, ar is secondary, vr is tertiary
        
        console.log(`\nNew XR Component Generated: \n ------------------ \n XRHumanBody v. 0.0.1 \n type: ${self.type} \n outgoing socket? ${(self.socket!=null)} \n objId: ${self.identity} \n height: ${self.height} \n weight: ${self.weight}\n ------------------`);
        console.log('core matrix:');
        console.log(self.application.core.layers.matrix);
        console.log('\n');
    }
}