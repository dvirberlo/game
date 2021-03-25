'use strict';

// -------------------- constants --------------------
const canvas = $("canvas#game")[0];
const wsPath = "ws://" + window.location.host;
const progressBar = $("div#progress");
const statusView = $("p#status");

// -------------------- load game --------------------
updateStatus("Loading code");
$.getScript("/scripts/dataManager.js", loadingData);

function loadingData(){
    updateStatus("Loading data");
    dataManager.load(loadingDraws);
}
function loadingDraws(){
    updateStatus("Loading Draws");
    $.getScript("/scripts/canvasManager.js", function(){
        canvasManager.load(connecting);
    });
}
function connecting(){
    $.getScript("/scripts/connectManager.js", function() {
        updateStatus("Connecting");
        connectManager.connect(startGame);
    });
}

function updateStatus(newStatus, progress = 20){
    statusView.text(newStatus + "...");
    let percentage = Number(progressBar[0].style.width.slice(0,-1))+progress + "%";
    progressBar[0].style.width = percentage;
    progressBar.text(percentage);
}

// -------------------- start game --------------------
function startGame(){
    updateStatus("staring");
}
