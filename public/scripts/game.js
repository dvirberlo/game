'use strict';

const canvas = $("canvas#game")[0];
const wsPath = "ws://" + window.location.host;

$.getScript("/scripts/dataManger.js", loadingData);
function loadingData(){
    console.log("loading data");
    $.getScript("/scripts/connectManger.js", connecting);
}
function connecting(){
    console.log("connecting");
    $.getScript("/scripts/canvasManger.js", canvasing);
}
function canvasing(){
    console.log("canvasing");
}
