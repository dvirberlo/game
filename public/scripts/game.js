'use strict';
/**
 * all code should be unreachable to browser's debugger console:
 * !function{}(...code...);
 * it is just development right now, so it is not like that.
 */
// alert("NOTE: game is under development");
// -------------------- constants --------------------
// websocket
const paths = {
    ws: "ws" + window.location.protocol.slice(4) + "//" + window.location.host,
    canvasManager: "/scripts/canvasManager.js",
    connectManager: "/scripts/connectManager.js"
};

// design
const navbar = $("#navbar");
const navDetails = {
    all: $("#navDetails"),
    resources: {
        lights: $("#navLights"),
        gems: $("#navGems"),
        flowers: $("#navFlowers")
    },
    username: $("#navUsername"),
    xp: $("#navXp")
};
const menus = {
    loadingMenu: $("#loadingMenu"),
    signup_login: $("#signup_login"),
    canvas: $("#game"),
    gameHome: $("#gameHome")
};
const progressBar = $("#progress");
const statusView = $("#status");

const gameFrame = {
    width: 800,
    height: 600
};
const animations = {
    show:"slow"
};

// login:
const loginInputs = {
    btn:$("#loginBtn"),
    username:$("input#loginUsername"),
    password:$("input#loginPassword"),
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

//game
let gameData = {
    username:false,
    password:false,
    magicType:false,
    xp:false,
    resources:false,
    ownedSpells:false,
    ownedClothes:false,
    mission:false
};
const homeInputs = {
    text: $("#missionText"),
    enter: $("#missionText"),
    another: $("#anotherMission")
};

// -------------------- game preperations --------------------
setView("loading")

updateLoadingStatus("Loading code");

// load canvasManager.js
$.ajax({async: false, url: paths.canvasManager, dataType: "script"});
updateLoadingStatus("Loading Draws");

canvasManager.load();

// load connectManager.js
$.ajax({async: false, url: paths.connectManager, dataType: "script"});
updateLoadingStatus("Connecting");

// set connect manager variables
connectManager.pongTime = 5000;// [ms]
connectManager.wsPath = paths.ws;
connectManager.createWS(function(){
    connectManager.tryCoockiesLogin(tryCoockiesLoginCallback);
});


//---------- main functions ----------
// login functions:
function tryCoockiesLoginCallback(result){
    if(result) startGame();
    else setView("login_signup");
}
function loginPressed(username, password){
    if(validForm(username, password)) connectManager.login(username, password, loginCallback);
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
    if(result){
        // reload page (auto login when reload)
        location.reload();
    }
    else {
        singupUsernameStatusUpdate(signupUsernameMsg.error, "");
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

//---------- game functions ----------
function startGame(){
    updateLoadingStatus("starting", 0);
    // LOGDEV
    console.log("game started");
    setView("game");
    connectManager.getData(function(data){
        gameData = data;
        // set canvas manager
        canvasManager.setCanvas(menus.canvas);
        for(let key in gameData) if(key !== "password")canvasManager.setData(key, gameData[key]);

        updateBar();
        // save any data from server
        connectManager.enterGameMode(function(key, value){
            gameData[key] = value;
            canvasManager.setData(key, value);
            updateBar();
        });

        // if player is already on a mission
        if(gameData.mission !== false) return showMission();
        // if it is the player's first time in game(xp=0)
        else if(gameData.xp == 0) showGuide();
        // just show home
        else showHome();
    });
}
// game mission
function showMission(){
    // TODO: showMission (missionMove, quitMission, toBattle), showBattle (battleMove, quitMission)
    canvasManager.clear();
    canvasManager.showMission(missionMove, quitMission);
}
function missionMove(movement){
    connectManager.missionMove(movement, function(newMission){
        gameData.mission = newMission;
        canvasManager.setData("mission", gameData.mission);
        showMission();
    });
}
function quitMission(){
    connectManager.quitMission(function(){
        gameData.mission = false;
        canvasManager.setData("mission", gameData.mission);
        showHome();
    });
}
// game guide
function showGuide(){
    canvasManager.showGuide(showHome);
}
// game home
function showHome(){
    setView("gameHome");
    anotherMission();
    homeInputs.another.click(anotherMission);
    homeInputs.enter.click(()=>{
        connectManager.enterMission(gameData.mission, enterMission);
    });
}
function anotherMission(){
    connectManager.anotherMission(mission=>{
        homeInputs.text.text(mission.text);
        gameData.mission = mission;
    });
}
function enterMission(){
    setView("game");
    connectManager.enterMission(function(newMission){
        gameData.mission = newMission;
        canvasManager.setData("mission", gameData.mission);
        showMission();
    });
}
function buySpell(id){
    connectManager.buySpell(id, function(){
        callback();
    });
}


//---------- design functions ----------
function updateLoadingStatus(newStatus, progress = 33){
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
            menus.loadingMenu.show(animations.show);
        break;
        case "login_signup":
            hideAll();
            menus.signup_login.show(animations.show);
            loginSetup();
            signupSetup();
        break;
        case "game":
            hideAll();
            menus.canvas.show(animations.show);
            canvasSetup(menus.canvas);
        break;
        case "gameHome":
            hideAll();
            menus.gameHome.show(animations.show);
            menus.gameHome.width(gameFrame.width);
            menus.gameHome.height(gameFrame.height);
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
        loginPressed(username, password);
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

function canvasSetup(canvas){
    navDetails.all.show(animations.show);
}
function updateBar(){
    for(let key in navDetails.resources) navDetails.resources[key].text(" " + gameData.resources[key]);
    navDetails.username.text(gameData.username);
    navDetails.xp.text(gameData.xp);
}
