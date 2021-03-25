'use strict';
const codes = {"loggedIn": 0}
window.connectManager = {
    connect: function(wsPath, loginInputs, canvasManager, callback, coockies=true, errors = 0){
        if(coockies && readCookie("username") && readCookie("password")){
            $.ajax({url:"/check" , data:{"username":readCookie("username"),"password":readCookie("password")} })
            .done(function(result){
                if(result == 0) return this.connect(wsPath, loginInputs, canvasManager, callback, false);
                connectManager.login(wsPath, readCookie("username"), readCookie("password"), callback);
                
            })
            .fail(function(e){
                console.log("ERROR: " + e.toString());
                if(errors > 3) return connectManager.connect(wsPath, loginInputs, canvasManager, callback, false);
                setTimeout(function(){
                    connectManager.connect(wsPath, loginInputs, canvasManager, callback, true, errors+1);
                }, 1000);
            });
        }
        else{
            loginInputs.login[0].addEventListener("click", function(){
                const username = loginInputs.username[0].value;
                const password = loginInputs.password[0].value;
                if(username.length > 0 && password.length > 0) connectManager.login(wsPath, username, password, callback);
                else loginInputs.error.text("Please enter valid username and password");
            });
        }
        console.log("connect");
    },
    login: function(wsPath, username, password, callback){
        this.userData.username = username;
        var ws = new WebSocket(wsPath);
        ws.addEventListener("open", function() {
           ws.send(connectManager.wsStringify({"username":username, "password":password}));
        });
        ws.addEventListener("message", function(event) {
            switch (connectManager.wsParse(event.data).code){
                case codes.loggedIn:
                    callback();
                    break;
            }
        });
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
    }
};


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