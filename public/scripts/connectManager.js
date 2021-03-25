'use strict';
window.connectManager = {
    connect: function(callback){
        console.log("connect");
        callback();
    }
};