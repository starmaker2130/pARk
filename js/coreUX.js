var coreUX = {
    buildLedger: function(name){
        let videoContainer = document.createElement('video');
        videoContainer.setAttribute('id', 'videoElement');
        videoContainer.setAttribute('autoplay', true);
        
        let mainContainer = document.querySelector('.main-app-container');
        mainContainer.setAttribute('id', name);
        
        var launchPageContainer = document.createElement('div');
        launchPageContainer.setAttribute('id', 'launch-page-container');
        launchPageContainer.classList.add('entry-layer');
        launchPageContainer.classList.add('overlay');
        
        var loadingBarContainer = document.createElement('div');
        loadingBarContainer.classList.add('loading-bar-container');
        
        var loadingBar = document.createElement('div');
        loadingBar.classList.add('loading-bar');
        
        loadingBarContainer.appendChild(loadingBar);
        
        var entryLayerInstructions = document.createElement('div');
        entryLayerInstructions.setAttribute('id', 'entry-layer-instructions');
        entryLayerInstructions.classList.add('overlay');
        entryLayerInstructions.append('loading...');
        
        launchPageContainer.appendChild(loadingBarContainer);
        launchPageContainer.appendChild(entryLayerInstructions);
        
        var embeddedSceneContainer = document.createElement('a-scene');
        
        embeddedSceneContainer.setAttribute('embedded', true);
        embeddedSceneContainer.classList.add('embedded-scene-container');
        embeddedSceneContainer.classList.add('experience-layer');
        embeddedSceneContainer.classList.add('ground');
        var assets = document.createElement('a-assets');
        assets.classList.add('embedded-assets-container');
        
        embeddedSceneContainer.appendChild(assets);
        
        mainContainer.appendChild(launchPageContainer);
        mainContainer.appendChild(entryLayerInstructions);
        mainContainer.appendChild(embeddedSceneContainer);
        mainContainer.appendChild(videoContainer);
        
        if (navigator.mediaDevices.getUserMedia) {       
            let video = document.querySelector("#videoElement");
            navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
                video.srcObject = stream;
            }).catch(function(error) {
                console.log("Something went wrong!");
          });
        }
        
        // TODO add blockchain code here
        
    },
    loadExperience: function(modules){  //loads the experience markup, dynamic content objects are present but not "active" to preserve memory
        //console.log(modules);
        const self = this;
        var loader = document.querySelector('.loading-bar');
        var loadingStart = Date.now();
        
        self.loadModules([modules]);
        
        let loadingTimer = setInterval(function(){
            let timeElapsed = Date.now() - loadingStart;

            if(timeElapsed>=5000){
                let loaderBar = document.querySelector('.loading-bar');
                loaderBar.style.width = '100%';
                loaderBar.style.backgroundColor = 'greenyellow';
                let loadingText = document.getElementById('entry-layer-instructions')
                
                while(loadingText.firstChild) loadingText.removeChild(loadingText.firstChild)
                clearInterval(loadingTimer);
                
                document.querySelector('.entry-layer').addEventListener('click', function(){
                    self.launchApplication(this, modules);
                });

                console.log('experience loaded.');
                return;
            }

            //console.log(timeElapsed/5000);
            loader.style.width = timeElapsed/50 + '%';
        }, 10);

        console.log('loading application experience...');
    },
    launchApplication: function(target, packages){ // dynamic content and associated modules are activated as the user is now viewing the experience
        var modules = packages;
        var self = this;
        let layer = target;
        let openingStart = Date.now();
        let loadingBar = document.querySelector('.loading-bar-container');

        let openingTimer = setInterval(function(){
            let timeElapsed = Date.now() - openingStart;

            if(timeElapsed>=500){
                
                self.launchModules([modules]);
                
                loadingBar.style.opacity = '0';
                layer.style.height = '0';
                
                //document.querySelector('.song-meta-data-panel-animation-0').emit('launchPlayers');
                
                clearInterval(openingTimer);
                return;
            }

            loadingBar.style.opacity = (500-timeElapsed)/500 + '';
            layer.style.height = (500-timeElapsed)/5 + '%';
        }, 10);

        console.log('opening application...');
    },
    launchModules: function(modules){
        //console.log(modules);
        if(modules!=null){
            for(var i = 0 ; i< modules.length; i++){
                modules[i].stream();//application.core.stream();
            }
        }
    },
    loadModules: function(modules){
        if(modules!=null){
            for(var i = 0 ; i<modules.length; i++){
                console.log(`loading module type: ${modules[i].type}`);
                modules[i].render();//application.core.stream();
            }
        }
    }
};