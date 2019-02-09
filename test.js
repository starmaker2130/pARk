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
                    'xrhumanbody': function(environment){
                        var renderView = self;
                        var componentArray = [];
                        var layerComponent;

                        if(renderView!=null&&environment!=null){
                            environment.application.core.childList[self.identity] = renderView;

                            console.log('attaching xrhumanbody component to environment.')

                            console.log('loading asset dependencies into experience asset container...');
                            // load all of the layers associated with the current model
                            for(var i=0; i<renderView.application.core.layers.matrix.length; i++){
                                for(var j=0; j<renderView.application.core.layers.matrix[i].length; j++){
                                    let layer = renderView.application.core.layers.matrix[i][j];
                                    
                                    if(layer!=null&&layer!=undefined){
                                        
                                        layerComponent = {
                                            obj: {
                                                name: `#${layer.identity}-obj`,
                                                elementType: 'a-asset-item',
                                                src: `${layer.obj}`,
                                                preload: 'true'
                                            },
                                            mtl: {
                                                name: `#${layer.identity}-mtl`,
                                                elementType: 'a-asset-item',
                                                src: `${layer.mtl}`,
                                                preload: 'true'
                                            }
                                        };
                                       
                                        componentArray.push(layerComponent.obj);
                                        componentArray.push(layerComponent.mtl);
                                        environment.application.renderer.buildElement.push(layerComponent.obj);
                                        
                                        environment.application.renderer.buildElement.push(layerComponent.mtl);
                                    }
                                    
                                    console.log(`on layer ${layer.identity}`);
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
                            </a-entity>
    `,
                                    components: 
                                        componentArray
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

function XRBodyLayer(name, src){
    var self = this;
    /*
    *   name    |   String
    *   src     |   Array (Object) of Objects (name, obj, mtl, png | all Strings, last three are urls)
    */
    if(name==null||src==null){
       throw new Error('Cannot initialize this component without a name or texture source. XR Body Layer pec. v. 0.0.1');
    }
    else{
        this.type = 'xrbodylayer';//|   String
        this.identity = name;   //  |   String
        this.matrix = src;     //  |   Array (| five Objects or null pointers)
        this.socket = null;
        
        console.log(`\nNew XR Component Generated: \n ------------------ \n XRBodyLayer v. 0.0.1 \n type: ${self.type} \n outgoing socket? ${(self.socket!=null)} \n objId: ${self.identity}  \n matrix: ${self.matrix.length}\n ------------------`);
        console.log('matrix raw:');
        console.log(self.matrix);
        console.log('\n');
    }
}

const layer0 = new XRBodyLayer('outfit0', [{name: 'regbodytop', obj: '../media/model/regbodytop.obj', mtl: '../media/model/regbodytop.mtl', png: '../media/model/regbodytop.png'},{},{},{},{}]);

const layer1 = new XRBodyLayer('outfit1', [{name: 'plaidexeter', obj: '../media/model/plaidexeter.obj', mtl: '../media/model/plaidexeter.mtl', png: '../media/model/plaidexeter.png'},{},{},{},{}]);

const layer2 = new XRBodyLayer('outfit2', [{name: 'plaidmaryland', obj: '../media/model/plaidmaryland.obj', mtl: '../media/model/plaidmaryland.mtl', png: '../media/model/plaidmaryland.png'},{},{},{},{}]);
            
var model = new XRHumanBody('Patrice-Morgan', 1.85, 72.5);   //name, height in m, weight in kg

//layersAdded.push(model.addLayer(layer0));
model.addLayer(layer1);
model.addLayer(layer2);

console.log('core actual:\n----------------');
console.log(model.application.core.layers.matrix)
console.log('---------------------------------------------')

/*var XRMP = require('xraudioplayer');
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

*/