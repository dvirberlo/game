'use strict';
/**
 * all code should be unreachable to browser's debugger console:
 * !function{}(...code...);
 * it is just development right now, so it is not like that.
 */

// -------------------- constants --------------------
// websocket
const wsPath = "ws" + window.location.protocol.slice(4) + "//" + window.location.host;

// design
const loadingMenu = $("div#loadingMenu");
const loginMenu = $("div#loginMenu");
const signupMenu = $("div#signupMenu");
const canvas = $("canvas#game");
const allMenus = [loadingMenu, loginMenu, signupMenu, canvas];

const progressBar = $("div#progress");
const statusView = $("#status");

// login:
const loginInputs = {
    btn:$("#loginBtn"),
    username:$("input#loginUsername"),
    password:$("input#loginPassword"),
    remember:$("input#loginRemember"),
    formError:$("#loginFormError")
};
const loginMsg = {
    wrong: "Wrong username or password",
    valid: "Please enter valid username and password"
};

// signup:
const signupInputs = {
    btn:$("#signupBtn"),
    username:$("input#signupUsername"),
    password:$("input#signupPassword"),
    usernameStatus:$("#signupUsernameStatus")
};
const signupUsernameMsg = {
    avialable: "<i class='bi bi-emoji-smile'></i> username availabe!",
    unavialable: "<i class='bi bi-emoji-frown'></i> username unavailabe.",
    checking: "<i class='bi bi-arrow-repeat'></i> checking availability...",
    error: "<i class='bi bi-bug'></i> Sign up failed. please try again"
};


// -------------------- game preperations --------------------
setView("loading")

updateLoadingState("Loading code");

// some vars it will be needed
var gameData = {};

// load canvasManager.js
$.ajax({async: false, url: "/scripts/canvasManager.js", dataType: "script"});
updateLoadingState("Loading Draws");

canvasManager.load();

// load connectManager.js
$.ajax({async: false, url: "/scripts/connectManager.js", dataType: "script"});
updateLoadingState("Connecting");

// set a connect manager
connectManager.pongTime = 5000;// [ms]
connectManager.wsPath = wsPath;
connectManager.canvasManager = canvasManager;
connectManager.coockiesExpire = 365*100;
connectManager.createWS();
connectManager.tryCoockiesLogin(tryCoockiesLoginCallback);


//---------- main functions ----------
// login functions:
function tryCoockiesLoginCallback(username){
    if(username){
        saveUsername(username);
        startGame();
    }
    else setView("login_signup");
}
function loginPressed(password, username, remember){
    if(validForm(username, password)) connectManager.login(username, password, remember, loginCallback);
    else loginShowError();
}
function loginCallback(result){
    if(result) startGame();
    else loginShowError(true);
}

// signup functions:
function signupPressed(username, password){
    connectManager.signup(username, password, signupCallback);
}
function signupCallback(result){
    if(result) startGame();
    else {
        singupUsernameStatusUpdate(signupUsernameMsg.error, "text-danger");
        signupSetup();
    }
}
function checkUsernameAvailable(username){
    connectManager.checkUsernameAvailable(username, showUsernameAvailability);
}

// both functions:
function validForm(username, password){
    return username.length > 0 && password.length > 0 && username.length < 50 && password.length < 50;
}
function saveUsername(username){
    gameData.username = username;
}
function startGame(){
    updateLoadingState("starting", 0);
    console.log("game started");
    setView("game");
    // TODO canvasManager.start(connectManager);
}


//---------- design functions ----------
function updateLoadingState(newStatus, progress = 33){
    statusView.text(newStatus + "...");
    let percentage = Number(progressBar[0].style.width.slice(0,-1))+progress + "%";
    progressBar[0].style.width = percentage;
    progressBar.text(percentage);
}
function loginShowError(wrong = false){
    let error = loginMsg.valid;
    if(wrong) error = loginMsg.wrong;

    loginInputs.formError.text(error);
    loginInputs.password.val("");
    [loginInputs.username, loginInputs.password].forEach(input=>inputError(input));
    loginInputs.btn[0].disabled = false;
}
function inputError(input){
    input.addClass("is-invalid");
    input[0].onkeydown = function(){input.removeClass("is-invalid")};
}
function setView(view){
    switch (view){
        case "loading":
            hideAll();
            loadingMenu.show();
            break;
        case "login_signup":
            hideAll();
            loginMenu.show();
            signupMenu.show();
            loginSetup();
            signupSetup();
            break;
        case "game":
            hideAll();
            canvas.show();
            break;
    }
}
function hideAll(arr = allMenus){
    arr.forEach(function(menu){menu.hide()});
}
function loginSetup(){
    loginInputs.btn[0].onclick = function(){
        loginInputs.btn[0].disabled = true;
        const username = loginInputs.username.val();
        const password = loginInputs.password.val();
        const remember = loginInputs.remember[0].checked;
        loginPressed(username, password, remember);
    };
}
function signupSetup(){
    [signupInputs.btn, signupInputs.username, signupInputs.password].forEach(input=> input[0].disabled = false);
    // signup btn
    signupInputs.btn[0].onclick = function(){
        [signupInputs.btn, signupInputs.username, signupInputs.password].forEach(input=> input[0].disabled = true);
        const username = signupInputs.username.val();
        const password = signupInputs.password.val();
        signupPressed(username, password);
    };
    // check automaticly if username is available
    signupInputs.username[0].onkeydown = function(){
        signupInputs.btn[0].disabled = false;
        signupInputs.usernameStatus.removeClass(["text-success", "text-danger"]);
        signupInputs.usernameStatus.addClass("text-warning");
        signupInputs.usernameStatus.html(signupUsernameMsg.checking);
        checkUsernameAvailable(signupInputs.username.val());
    };
}
function showUsernameAvailability(isAva){
    signupInputs.usernameStatus.removeClass(["text-success", "text-danger", "text-warning"]);
    if(isAva){
        singupUsernameStatusUpdate(signupUsernameMsg.avialable, "text-success");
    }
    else{
        singupUsernameStatusUpdate(signupUsernameMsg.unavialable, "text-danger");
        signupInputs.btn[0].disabled = true;
    }
}
function singupUsernameStatusUpdate(html, classes){
    signupInputs.usernameStatus.removeClass(["text-success", "text-danger", "text-warning"]);
    signupInputs.btn[0].disabled = false;
    signupInputs.usernameStatus.addClass(classes);
    signupInputs.usernameStatus.html(html);
}
