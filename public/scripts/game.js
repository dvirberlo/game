'use strict';

// -------------------- constants --------------------
const allButCanvas = $("div#allButCanvas");
const canvas = $("canvas#game")[0];

const wsPath = "ws://" + window.location.host;

const progressBar = $("div#progress");
const statusView = $("p#status");

const loginBtn = $("button#login");
const usernameInput = $("input#username");
const passwordInput = $("input#password");
const rememberCheck = $("input#remember");
const formError = $("small#formError");

// -------------------- load game --------------------
updateStatus("Loading code");
$.getScript("/scripts/dataManager.js", loadingDraws);

function loadingDraws(){
    updateStatus("Loading Draws");
    $.getScript("/scripts/canvasManager.js", function(){
        canvasManager.load(connecting);
    });
}
function connecting(){
    $.getScript("/scripts/connectManager.js", function() {
        updateStatus("Connecting");
        connectManager.connect(wsPath, {"login":loginBtn, "username":usernameInput, "password":passwordInput, "remember":rememberCheck, "error":formError}, canvasManager, gameStarted);
    });
}

function updateStatus(newStatus, progress = 30){
    statusView.text(newStatus + "...");
    let percentage = Number(progressBar[0].style.width.slice(0,-1))+progress + "%";
    progressBar[0].style.width = percentage;
    progressBar.text(percentage);
}

// -------------------- start game --------------------
function gameStarted(){
    updateStatus("started");
    //---------- hide others and start the game ----------
    allButCanvas.hide();
    canvasManager.start(connectManager);
}
