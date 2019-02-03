function TreeHouse(){
    var self = this;
    
    this.buildLedger = function(name, sensorsConnected){ // builds the app gui for the associated document type and adds a new entry into the distributed ledger space (hyperspace)
        var sensors = sensorsConnected;
        if(sensorsConnected==null){
            sensors = {
                video: true,
                audio: true
            };
        }
        
        let videoContainer = document.createElement('video');
        videoContainer.setAttribute('id', 'videoElement');        
        
        let audioSource = document.createElement('source');
        audioSource.setAttribute('id', 'static-selector');
        audioSource.setAttribute('src', '');
        audioSource.setAttribute('type', 'audio/mpeg');
        
        let audioContainer = document.createElement('audio');
        audioContainer.setAttribute('id', 'html5-audio-player');
        audioContainer.setAttribute('controls', true);
        audioContainer.setAttribute('autoplay', false);
        
        audioContainer.appendChild(audioSource);
        
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
        mainContainer.appendChild(audioContainer);
        
        if(sensors.video){
            self.startEyeStream();
        }        
              
        if(sensors.frame=='dynamic'){
            // core UI funcitons available in the TreeHouse specification
            self.ui.checkWindowDimensions();
            self.ui.setFocus(0);
            
            window.addEventListener('resize', function(){
                self.ui.checkWindowDimensions();
            });
        }
            
        // TODO add blockchain code here
        
    }
    
    this.loadExperience = function(modules){  //loads the experience markup, dynamic content objects are present but not "active" to preserve memory
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
    }
    
    this.launchApplication = function(target, packages){ // dynamic content and associated modules are activated as the user is now viewing the experience
        var modules = packages;
        var self = this;
        let layer = target;
        let openingStart = Date.now();
        let loadingBar = document.querySelector('.loading-bar-container');

        let openingTimer = setInterval(function(){
            let timeElapsed = Date.now() - openingStart;

            if(timeElapsed>=500){
                
                //removed in current version
                //the environment has an internal pointer to all modules and launches the modules that are attached to it to better compose that functionality
                
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
    }
    
    this.launchModules = function(modules){
        //console.log(modules);
        if(modules!=null){
            for(var i = 0 ; i< modules.length; i++){
                console.log(`launching active dependencies for module type: ${modules[i].type}`);
                modules[i].stream();//application.core.stream();
            }
        }
    }
    
    this.loadModules = function(modules){
        if(modules!=null){
            for(var i = 0 ; i<modules.length; i++){
                console.log(`loading module type: ${modules[i].type}`);
                modules[i].render();//application.core.stream();
            }
        }
    }
    
    this.ui = {
        application: {
            focus: 0,
            onMobile: null,
            onDesktop: null,
            isFullScreen: false,
            videoStreaming: false
        },
        checkWindowDimensions : function(){
            var width = window.innerWidth;
            var height = window.innerHeight;
            var app = self.ui.application;
            
            if(width<768){
                app.onMobile = true;
                app.onDesktop = false;
                console.log('this is a mobile device with respect to its dimensions');
            }
            else{
                app.onMobile = false;
                app.onDesktop = true;
                console.log('this is a desktop device with respect to its dimensions');
            }
        },
        requestFullScreen : function(element) { //    makes the application fullscreen on fullscreen equipped browsers
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen; // Supports most browsers and their versions.
            var app = self.ui.application;

            if (requestMethod) { // Native full screen.
                requestMethod.call(element);
                app.isFullScreen = true;
            } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                    app.isFullScreen = true;
                }
            }
        },
        exitFullScreen : function(){
            //    makes the application fullscreen on fullscreen equipped browsers
        /*var requestMethod = element.exitFullScreen || element.webkitCancelFullScreen || element.mozCancelFullScreen || element.msExitFullScreen; // Supports most browsers and their versions.
            */
            var app = self.ui.application;
            
            if (document.exitFullscreen) {
                document.exitFullscreen();
                app.isFullScreen = false;
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
                app.isFullScreen = false;
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
                app.isFullScreen = false;
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
                app.isFullScreen = false;
            }
        },
        setFocus : function(focus){
            var app = self.ui.application;
            app.focus = focus;
        },
        isFullScreen : function(){
            var app = self.ui.application;
            return app.isFullScreen;
        }
    };
    
    this.stopEyeStream = function(){
        if (navigator.mediaDevices.getUserMedia) {       
            let video = document.querySelector("#videoElement");
            video.setAttribute('autoplay', false);
            navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
                video.srcObject = '';
                self.ui.application.videoStreaming = false;
            }).catch(function(error) {
                console.log("Something went wrong!");
          });
        }
    }
    
    this.startEyeStream = function(){
        if (navigator.mediaDevices.getUserMedia) {       
            let video = document.querySelector("#videoElement");
            video.setAttribute('autoplay', true);
            navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
                video.srcObject = stream;
                self.ui.application.videoStreaming = true;
            }).catch(function(error) {
                console.log("Something went wrong!");
          });
        }
    }   
}