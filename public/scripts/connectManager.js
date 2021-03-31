'use strict';
/**
 * all code should be unreachable to browser's debugger console:
 * !function{}(...game.js:varible = connectManager;...);
 * it is just development right now, so it is not like that.
 */

let codes;
let ws;
let gameMode = false;
window.connectManager = {
    createWS: function(callback) {
        ws = new WebSocket(connectManager.wsPath);
        ws.onmessage = function(event){
            codes = wsParse(event.data);
            ws.onmessage = null;
            callback();
        };
    },
    tryCoockiesLogin: function(callback){
        const username = readCookie("username");
        const password = readCookie("password");
        function coockiesLogin(){
            connectManager.login(username, password, false, function(result){
                if(result) callback(username, password, true);
                else callback(null, null, false);
            });
        }
        if(ws.readyState === WebSocket.OPEN) coockiesLogin();
        else ws.onopen = coockiesLogin;
    },
    login: function(username, password, remember, callback){
        // set timeout(connectManager.pongTime): if there is no positive respone- callbacks a failure
        var timeout;
        function failed(){
            ws.onmessage = null;
            callback(null, null, false);
        };
        timeout = setTimeout(failed, connectManager.pongTime);

        wsSend({code:codes.login.request, username:username, password:password});
        ws.onmessage = function(event){
            switch(wsParse(event.data).code){
                case codes.login.success:
                    clearTimeout(timeout);
                    ws.onmessage = null;
                    if(remember){
                        writeCookie("username", username, connectManager.coockiesExpire);
                        writeCookie("password", password, connectManager.coockiesExpire);
                    }
                    callback(username, password, true);
                    break;
                case codes.login.fail:
                    clearTimeout(timeout);
                    failed();
                    break;
            }
        };
    },
    checkUsernameAvailable: function(username, callback){
        $.ajax({
            method: "GET",
            url: "/usernameCheck",
            data: { username: username }
        })
        .done(msg=>{
            if(msg == codes.usernameCheck.unexist) callback(username, true);
            else callback(username, false);
        })
        .fail(err=> {
            console.log("error: ");
            console.log(err);
            callback(username, true);
        });
    },
    signup: function(username, password, callback){
        // set timeout(connectManager.pongTime): if there is no positive respone- callbacks a failure
        var timeout;
        function failed(){
            ws.onmessage = null;
            callback(null, null, false);
        };
        timeout = setTimeout(failed, connectManager.pongTime);
        wsSend({code:codes.signup.request, username:username, password:password});
        ws.onmessage = function(event){
            switch(wsParse(event.data).code){
                case codes.signup.success:
                    clearTimeout(timeout);
                    ws.onmessage = null;
                    writeCookie("username", username, connectManager.coockiesExpire);
                    writeCookie("password", password, connectManager.coockiesExpire);
                    callback(username, password, true);
                    break;
                case codes.signup.fail:
                    clearTimeout(timeout);
                    failed();
                    break;
            }
        };
    },

    // game
    getData: function(oldData, callback){
        ws.onmessage = wsOnMessage(codes.game.getData, function(result){
            ws.onmessage = null;
            if(result) callback(result.result);
            else callback(false);
        });
        wsSend({code: codes.game.getData.request});
    },
    enterGameMode: function(callback){
        gameMode = ws.addEventListener("message", function(event){
            const data = wsParse(event.data);
            if(data.code == codes.gameMode){
                callback(data.key, data.value);
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
    buyClothes: function(callback){
        // TODO
    },
    buySpell: function(callback){
        // TODO
    },


    coockiesExpire: 2000,
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
function connectionError(){
    console.log("connection error");
    // TODO
    callback(false);
}
function wsOnMessage(codeTable, callback){
    return function(event){
        const result = wsParse(event.data);
        switch(result.code){
            case codeTable.success:
                callback(result);
                break;
            case codeTable.fail:
                callback(false);
                break;
        }
    };
}

// ----- coockies functions -----
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