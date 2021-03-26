'use strict';

// -------------------- constants --------------------
const allButCanvas = $("div#allButCanvas");
const canvas = $("canvas#game");

const wsPath = "ws://" + window.location.host;
const checkPath = "/check";

const progressBar = $("div#progress");
const statusView = $("p#status");

const loginBtn = $("button#loginBtn");
const usernameInput = $("input#username");
const passwordInput = $("input#password");
const rememberCheck = $("input#remember");
const formError = $("small#formError");

// -------------------- game preperations --------------------
updateStatus("Loading code");
$.getScript("/scripts/canvasManager.js", canvasLoaded);

function canvasLoaded(){
    updateStatus("Loading Draws");
    canvasManager.load(loadConnect);
}
function loadConnect(){
    $.getScript("/scripts/connectManager.js", function() {
        updateStatus("Connecting");
        connectManager.pongTime = 5000;
        connectManager.wsPath = wsPath;
        connectManager.checkPath = checkPath;
        connectManager.loginInputs = {"login":loginBtn, "username":usernameInput, "password":passwordInput, "remember":rememberCheck, "error":formError};
        connectManager.canvasManager = canvasManager;
        connectManager.connect(loginConnect);
    });
}

function loginConnect(isConnected, wrong = false){
    if(isConnected)return gameStarted();

    if(wrong) formShowError("Wrong username or password");
    loginBtn[0].onclick = function(){
        loginBtn[0].disabled = true;
        const username = usernameInput.val();
        const password = passwordInput.val();
        const remember = rememberCheck[0].checked;
        if(validUsernameAndPassword(username, password)) connectManager.login(username, password, remember, loginConnect);
        else formShowError("Please enter valid username and password");
    };
}
function validUsernameAndPassword(username, password){
    return username.length > 0 && password.length > 0 && username.length < 50 && password.length < 50;
}

//---------- design ----------
function updateStatus(newStatus, progress = 33){
    statusView.text(newStatus + "...");
    let percentage = Number(progressBar[0].style.width.slice(0,-1))+progress + "%";
    progressBar[0].style.width = percentage;
    progressBar.text(percentage);
}
function formShowError(error){
    formError.text(error);
    passwordInput.val("");
    usernameInput.addClass("is-invalid");
    passwordInput.addClass("is-invalid");
    usernameInput[0].onkeydown = function(){usernameInput.removeClass("is-invalid")};
    passwordInput[0].onkeydown = function(){passwordInput.removeClass("is-invalid")};
    loginBtn[0].disabled = false;
}


// -------------------- start game --------------------
function gameStarted(){
    updateStatus("started", 0);
    console.log("started");
    //---------- hide others and start the game ----------
    allButCanvas.hide();
    canvas.show();
    canvasManager.start(connectManager);
}
