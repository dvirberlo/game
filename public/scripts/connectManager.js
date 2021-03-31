'use strict';
/**
 * all code should be unreachable to browser's debugger console:
 * !function{}(...game.js:varible = connectManager;...);
 * it is just development right now, so it is not like that.
 */

const coockiesExpire = 365*100;
let codesTable;
let ws;
let gameMode = false;
window.connectManager = {
    createWS: function(callback) {
        ws = new WebSocket(connectManager.wsPath);
        // get codesTable from server
        ws.onmessage = function(event){
            codesTable = wsParse(event.data);
            ws.onmessage = null;
            callback();
        };
    },
    tryCoockiesLogin: function(callback){
        const username = readCookie("username");
        const password = readCookie("password");

        connectManager.login(username, password, false, callback);
    },
    login: function(username, password, callback){
        const code = codesTable.login;
        ws.onmessage = wsOnMessage(code, function(res){
            if(res){
                writeCookie("username", username);
                writeCookie("password", password);
            }
            callback(res);
        });
        wsSend({code: code, username:username, password:password});
    },
    checkUsernameAvailable: function(username, callback){
        $.ajax({
            method: "GET",
            url: "/usernameCheck",
            data: { username: username }
        })
        .done(msg=>{
            callback(username, ajaxParse(msg));
        })
        .fail(err=> {
            // LOGDEV
            console.log("error: ");
            console.log(err);

            callback(username, false);
        });
    },
    signup: function(username, password, callback){
        $.ajax({
            method: "GET",
            url: "/signup",
            data: { username: username, password: password }
        })
        .done(msg=>{
            if(ajaxParse(msg)){
                writeCookie("username", username);
                writeCookie("password", password);
                callback(true);
            }
            else callback(false);
        })
        .fail(err=> {
            // LOGDEV
            console.log("error: ");
            console.log(err);

            callback(username, false);
        });
    },

    // game
    getData: function(callback){
        const code = codesTable.getData;
        ws.onmessage = wsOnMessage(code, callback);
        wsSend({code: code});
    },
    enterGameMode: function(callback){
        gameMode = ws.addEventListener("message", function(event){
            const res = wsParse(event.data).response;
            if(data.code == codesTable.gameMode){
                callback(res.key, res.value);
            }
        });
    },
    missionMove: function(movement, callback){
        // TODO
    },
    missionQuit: function(callback){
        // TODO
    },
    enterMission: function(callback){
        // TODO
    },
    updateClothes: function(callback){
        // TODO
    },
    updateSpell: function(callback){
        // TODO
    },


    pongTime: 10000
};

function wsSend(obj){
    // TODO: handle network issues
    if(ws.readyState === WebSocket.OPEN) ws.send(wsStringify(obj));
    else{
        // TODO
        // LOGDEV
        console.log("wsSend error");
    }
}

function wsStringify(obj){
    return JSON.stringify(obj);
}
function wsParse(data){
    return JSON.parse(data);
}
function ajaxParse(data){
    return JSON.parse(data);
}
function connectionError(){
    // LOGDEV
    console.log("connection error");
    // TODO
    callback(false);
}
function wsOnMessage(code, callback){
    return event=>{
        ws.onmessage = null;
        const data = wsParse(event.data);
        // (TODO: is it needed to use eventListener to multy request support?)
        // if codes doesnt fit- throw error
        if(data.code != code) throw "error: ws codes doesnt fit";
        callback(data.response);
    };
}

// ----- coockies functions -----
function writeCookie(cname, cvalue, days = coockiesExpire){
    let d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function readCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}