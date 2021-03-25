'use strict';

// -------------------- constants --------------------
const canvas = $("canvas#game")[0];
const wsPath = "ws://" + window.location.host;
const statusView = $("span#status");

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

function updateStatus(newStatus){
    statusView.text(newStatus + "...");
}

// -------------------- start game --------------------
function startGame(){
    updateStatus("staring");

}
