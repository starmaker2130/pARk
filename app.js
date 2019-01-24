"use strict";

var bodyParser = require('body-parser');
var express = require('express');
var WhichBrowser = require('which-browser');

var app = {
    instance: express(),
    config: {
        PORT: process.env.PORT || 3000,
        DIRECTORY: [
            './',       //0
            './css',    //1
            './js',     //2
            './media/audio',    //3
            './media/icon',     //4
            './media/img',      //5
            './media/pattern',  //6
            './media/texture',  //7
            './media/video'     //8
        ]
    }
};

app.instance.engine('html', require('ejs').renderFile);

app.instance.use(bodyParser.json({limit: '50mb'}));
app.instance.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.instance.get('/', function(req, res){
    const deviceConnected = new WhichBrowser(req.headers);
    if(deviceConnected.isType('desktop')){
        console.log(`Connected to a desktop computer. \n ${deviceConnected.toString()}.`);
    }
    else{
        console.log(`Connected to a mobile computer. \n ${deviceConnected.toString()}.`);
    }
    res.render('index.html', {root: app.config.DIRECTORY[0]});
});

app.instance.get('/universe', function(req, res){
    res.render('universe.html', {root: app.config.DIRECTORY[0]});
});

app.instance.get('/css/:stylesheet_id', function(req, res){
    let stylesheetId = req.params.stylesheet_id;
    res.sendFile(stylesheetId, {root: app.config.DIRECTORY[1]});
});

app.instance.get('/js/:script_id', function(req, res){
    let scriptId = req.params.script_id;
    res.sendFile(scriptId, {root: app.config.DIRECTORY[2]});
});

app.instance.get('/media/texture/:texture_id', function(req, res){
    let textureId = req.params.texture_id;
    res.sendFile(textureId, {root: app.config.DIRECTORY[7]});
});

app.instance.get('/media/video/:video_id', function(req, res){
    let videoId = req.params.video_id;
    res.sendFile(videoId, {root: app.config.DIRECTORY[8]});
});

app.instance.listen(app.config.PORT, function(){
    console.log(`[0] listening on port ${app.config.PORT}`);
});

/*
var io = require('socket.io').listen(app.listen(config.PORT, function(){
    console.log(`[0] listening on port ${config.PORT}`);
}));*/