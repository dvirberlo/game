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
const menus = {
    loadingMenu: $("#loadingMenu"),
    loginMenu: $("#loginMenu"),
    signupMenu: $("#signupMenu"),
    canvas: $("canvas#game")
};

const progressBar = $("#progress");
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
    usernameStatus:$("#signupUsernameStatus"),
    usernameText:$("#signupUsernameText"),
    usernameBold:$("#signupUsernameBold"),
    usernameIcon:$("#signupUsernameIcon")
};
const signupUsernameMsg = {
    avialable: {iconClass: ["bi", "bi-emoji-smile"], msg: "- is availabe!", textClass: ["text-success", "form-text"]},
    unavialable: {iconClass: ["bi", "bi-emoji-frown"], msg: "- is unavailabe.", textClass: ["text-danger", "form-text"]},
    checking: {iconClass: ["bi", "bi-arrow-repeat"], msg: "- checking availability...", textClass: ["text-warning", "form-text"]},
    error: {iconClass: ["bi", "bi-bug"], msg: "- Sign up failed. please try again", textClass: ["text-danger", "form-text"]}
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
function signupCallback(username, result){
    if(result){
        startGame();
        saveUsername(username);
    }
    else {
        singupUsernameStatusUpdate(signupUsernameMsg.error, username);
        signupSetup();
    }
}
function checkUsernameAvailable(username){
    // if username invalid- doesnt check
    if(!validUsername(username)) return false;

    singupUsernameStatusUpdate(signupUsernameMsg.checking, username);
    connectManager.checkUsernameAvailable(username, showUsernameAvailability);
}

// both functions:
function validForm(username, password){
    return validUsername(username) && password.length > 0  && password.length < 50;
}
function validUsername(username){
    return username.length > 0 && username.length < 50;
}
function saveUsername(username){
    gameData.username = username;
}
function startGame(){
    updateLoadingState("starting", 0);
    // LOGDEV
    console.log("game started");
    setView("game");
    // TODO canvasManager.start(connectManager);
}


//---------- design functions ----------
function updateLoadingState(newStatus, progress = 33){
    statusView.text(newStatus + "...");
    let  newValue = Number(progressBar.attr("aria-valuenow")) + progress;
    progressBar.attr("aria-valuenow", newValue);
    progressBar.width(newValue + "%");
    progressBar.text(newValue + "%");
}
function loginShowError(wrong = false){
    let error = loginMsg.valid;
    if(wrong) error = loginMsg.wrong;

    loginInputs.formError.text(error);
    loginInputs.password.val("");
    [loginInputs.username, loginInputs.password].forEach(input=>inputError(input));
    loginInputs.btn.prop("disabled", false);
}
function inputError(input){
    input.addClass("is-invalid");
    input.bind('input', function(){input.removeClass("is-invalid")});
}
function setView(view){
    switch (view){
        case "loading":
            hideAll();
            menus.loadingMenu.show();
            break;
        case "login_signup":
            hideAll();
            menus.loginMenu.show();
            menus.signupMenu.show();
            loginSetup();
            signupSetup();
            break;
        case "game":
            hideAll();
            menus.canvas.show();
            break;
    }
}
function hideAll(obj = menus){
    for(let key in obj) obj[key].hide();
}
function loginSetup(){
    loginInputs.btn.click(function(){
        loginInputs.btn.prop("disabled", true);
        const username = loginInputs.username.val();
        const password = loginInputs.password.val();
        const remember = loginInputs.remember.prop("checked", true);
        loginPressed(username, password, remember);
    });
}
function signupSetup(){
    [signupInputs.btn, signupInputs.username, signupInputs.password].forEach(input=> input.prop("disabled", false));
    // signup btn
    signupInputs.btn.click(function(){
        if($(this).prop("disabled")) return false;
        [signupInputs.btn, signupInputs.username, signupInputs.password].forEach(input=> input.prop("disabled", true));
        const username = signupInputs.username.val();
        const password = signupInputs.password.val();
        signupPressed(username, password);
    });
    // check automaticly if username is available
    signupInputs.username.bind('input', function(){
        const username = $(this).val();
        checkUsernameAvailable(username);
    });
}
function showUsernameAvailability(username, isAva){
    if(isAva) singupUsernameStatusUpdate(signupUsernameMsg.avialable, username);
    else{
        singupUsernameStatusUpdate(signupUsernameMsg.unavialable, username);
        signupInputs.btn.prop("disabled", true);
    }
    signupInputs.usernameBold.html(username);
}
function singupUsernameStatusUpdate(status, username){
    // do not show if username have already changed
    if(username != signupInputs.username.val()) return false;

    signupInputs.btn.prop("disabled", false);

    signupInputs.usernameStatus.removeClass();
    signupInputs.usernameStatus.addClass(status.textClass);

    signupInputs.usernameText.text(status.msg);

    signupInputs.usernameBold.text(username);

    signupInputs.usernameIcon.removeClass();
    signupInputs.usernameIcon.addClass(status.iconClass);
}
