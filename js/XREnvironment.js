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
    
    this.add = function(childObject){
        var self = this;
        self.application.core.childList.push(childObject);
        //self.pointers.elements.push(``)
        return self.application.core.childList.length;
    }
    
    this.stream = function(){
        console.log('no dynamic dependencies attached.')
        console.log('static experience rendered.');
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
                'xraudio': function(){
                    console.log('execute handler for xraudioplayer object');
                },
                'xrhumanbody': function(){
                    console.log('execute handler for xrhumanbody object');
                }
            },
            createPointer: function(target){

            },
            buildElement: function(element){
                
            }
        },
        core: {
            pointers : {
                renderHistory: 0,
                experienceContainer: null,
                assetsContainer: null,
                elements: []
            },
            attachFrameToDOM: function(key){
                //console.log(key.elementType);
                //console.log(key);
                var XRComponent = document.createElement(key.elementType);
                
                self.application.core.pointers.experienceContainer.appendChild(XRComponent);
                
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
                else{                    
                    componentPointer.setAttribute('geometry', key.geometry);
                    componentPointer.setAttribute('rotation', key.rotation);
                    componentPointer.setAttribute('material', key.material);
                }
                
                console.log(componentPointer);
            },
            experience: [
                {
                    name: '.embedded-assets-container',
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
                    elementType: 'a-entity',
                    geometry: `primitive: plane; width: ${self.width}; height: ${self.height};`,
                    rotation: '-90 0 0',
                    material: `src: #floor-texture; repeat: ${self.width} ${self.height}; opacity: 1.0;`,
                    children: []
                },
                {
                    name: '#background-sky',
                    elementType: 'a-sky',
                    transparent: 'true',
                    opacity: '0',
                    children: []
                },
                {
                    name: '#main-user-camera',
                    elementType: 'a-camera',
                    position: '0 1.6 0',
                    rotation: '0 0 0',
                    children: []
                }
            ],
            stream: function(){
                console.log('streaming xr environment core.');
            },
            render : function(){
                //var self = this;
                var core = self.application.core;
                var experience = core.experience;
                console.log('rendering environment...');
                
                if(core.pointers.experienceContainer===null){
                    core.pointers.experienceContainer = document.querySelector('.embedded-scene-container');
                    console.log('connected to experience container.');
                    //console.log(core.pointers.experienceContainer);
                }
                
                if(core.pointers.assetsContainer===null){
                    core.pointers.assetsContainer = document.querySelector('.embedded-assets-container');
                    
                    for(var i=0; i<experience[0].children.length; i++){
                        let current = experience[0].children[i];
                        let childElement = document.createElement(current.elementType);
                        
                      //  console.log(current.name);
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
                }
                
                if(core.pointers.renderHistory === 0){
                    Object.keys(experience).forEach(function(key, idx) {
                        var component = experience[key];
                        if(component.elementType!='a-assets'&&component.elementType!=null){
                            core.attachFrameToDOM(component);
                        }
                    });
                }
                
            },
            childList: []
        }
    };
}