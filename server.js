'use strict';

const express  = require("express"),
      path = require("path"),
      SocketServer = require("ws").Server,
      PORT = process.env.PORT || 5000;

const server = express()
    .use(express.static(path.join(__dirname, "public")))
    .set("views", path.join(__dirname, "views"))
    .set("view engine", "ejs")
    .get("/", (req, res)=> res.render("index"))
    .get("/game", (req, res)=> res.render("game"))
    .listen(PORT, ()=>console.log(`Liseting on ${PORT}`));

process.on("exit", (code)=>console.log(`About to exit with code ${code}`));


// ---------------------------------------- the game ----------------------------------------
const maxMsg = 50;

// -------------------- websocket --------------------
const wss = new SocketServer({server});
wss.on("connection", (ws, req, client)=>{
    //on connection

    ws.on("message", (msg)=>{
		//on message
    });
    ws.on("close", ()=>{
		//on close
    });
});

function getId(len = idLength){
    let r;
    do{
        r = Math.floor((1 + Math.random()) * 0x10 ** len).toString(16).substring(1);
    }while(typeof data[r] !== "undefined")
    return r;
}
function validName(msg){
    //NEXT
    if(msg.length > 1) return true;
    return false;
}


// -------------------- database --------------------
function newUsername(username, password){
    return true;
}
function checkUser(username, password){
    return false;
}