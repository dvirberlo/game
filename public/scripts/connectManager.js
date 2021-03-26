'use strict';
const codes = {"loggedIn": 0};
var ws;
window.connectManager = {
    connect: function(callback, coockies=true, errors = 0){
        ws = new WebSocket(connectManager.wsPath);
        if(coockies && readCookie("username") && readCookie("password")){
            connectManager.login(readCookie("username"), readCookie("password"), false, callback);
        }
        else{
            return callback(false);
        }
    },
    login: function(username, password, remember, callback){
        connectManager.userData.username = username;

        // TODO think: eventListener/onFunc
        var timeout;
        timeout = setTimeout(function(){ws.onmessage = null;return callback(false, true)}, connectManager.pongTime);
        if(ws.readyState == WebSocket.OPEN) ws.send(connectManager.wsStringify({"username":username, "password":password}));
        else{
            connectionError(callback);
        }
        ws.onmessage = function(event){
            switch (connectManager.wsParse(event.data).code){
                case codes.loggedIn:
                    clearTimeout(timeout);
                    if(remember){
                        writeCookie("username", username, coockiesExpire);
                        writeCookie("password", password, coockiesExpire);
                    }
                    callback(true);
                    break;
            }
        };
    },
    wsStringify: function(obj){
        return JSON.stringify(obj);
    },
    wsParse: function(obj){
        return JSON.parse(obj);
    },
    userData: {
        username: "",
        gameState:{ }
    },
    "coockiesExpire": 2000
};

function connectionError(){
    console.log("connection error");
    // TODO
    callback(false);
}

// ----- coockies -----
function writeCookie(cname, cvalue, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function readCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}