/*
*   author: Patrice-Morgan Ongoly (@starmaker2130)
*   last modified: tuesday, january 29, 2019 0844 utc-5
*   version: 0.0.2
*   title: public Augmented Reality kinectome
*
*   
*
*
*
*/

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
            './media/video',     //8
            './media/model'     //9
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

app.instance.get('/cARd', function(req, res){
    res.render('CreativeAugmentedRealityDesktop.html', {root: app.config.DIRECTORY[0]});
});

app.instance.get('/htc', function(req, res){
    res.render('htc.html', {root: app.config.DIRECTORY[0]});
});

app.instance.get('/gencoll', function(req, res){
    res.render('gcollection.html', {root: app.config.DIRECTORY[0]});
});

app.instance.get('/xraudio', function(req, res){
    res.render('xrtest.html', {root: app.config.DIRECTORY[0]});
});

app.instance.get('/xrbody', function(req, res){
    res.render('xrbody.html', {root: app.config.DIRECTORY[0]});
});

app.instance.get('/xrbody2', function(req, res){
    res.render('body2.html', {root: app.config.DIRECTORY[0]});
});

app.instance.get('/css/:stylesheet_id', function(req, res){
    let stylesheetId = req.params.stylesheet_id;
    res.sendFile(stylesheetId, {root: app.config.DIRECTORY[1]});
});

app.instance.get('/js/:script_id', function(req, res){
    let scriptId = req.params.script_id;
    res.sendFile(scriptId, {root: app.config.DIRECTORY[2]});
});

app.instance.get('/media/audio/:audio_id', function(req, res){
    let audioId = req.params.audio_id;
    res.sendFile(audioId, {root: app.config.DIRECTORY[3]});
});

app.instance.get('/media/icon/:icon_id', function(req, res){
    let iconId = req.params.icon_id;
    res.sendFile(iconId, {root: app.config.DIRECTORY[4]});
});

app.instance.get('/media/img/:img_id', function(req, res){
    let imgId = req.params.img_id;
    res.sendFile(imgId, {root: app.config.DIRECTORY[5]});
});

app.instance.get('/media/texture/:texture_id', function(req, res){
    let textureId = req.params.texture_id;
    res.sendFile(textureId, {root: app.config.DIRECTORY[7]});
});

app.instance.get('/media/video/:video_id', function(req, res){
    let videoId = req.params.video_id;
    res.sendFile(videoId, {root: app.config.DIRECTORY[8]});
});

app.instance.get('/media/model/:model_id', function(req, res){
    let modelId = req.params.model_id;
    res.sendFile(modelId, {root: app.config.DIRECTORY[9]});
});

app.instance.listen(app.config.PORT, function(){
    console.log(`[0] listening on port ${app.config.PORT}`);
});

/*
var io = require('socket.io').listen(app.listen(config.PORT, function(){
    console.log(`[0] listening on port ${config.PORT}`);
}));*/