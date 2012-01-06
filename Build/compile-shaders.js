#! /usr/bin/env node

var fs = require('fs');

var vertex = fs.readFileSync('Source/Shaders/Vertex.glsl').toString().replace(/\t/g, '');
var fragment = fs.readFileSync('Source/Shaders/Fragment.glsl').toString().replace(/\t/g, '');

var shaders = {};
shaders['vertex'] = vertex.split("\n");
shaders['fragment'] = fragment.split("\n");

var header = fs.readFileSync('Build/header.txt');

var out = fs.writeFileSync('Source/Shaders.js', header + 'Feather.WebGL.prototype.shaders = \n' + JSON.stringify(shaders, null, '\t'));