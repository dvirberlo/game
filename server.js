'use strict';
const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB ="magicbamba";
const MONGODB_COLLECTION = "herokutest";
const express  = require("express"),
SocketServer = require("ws").Server,
path = require("path"),
PORT = process.env.PORT || 5000;

const startedDocument = {username:"", password:"", magicType:0, xp:0, resources:[10,0,0,0,0], ownedSpells:[], ownedClothes:[], state:{}};

  
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

function loginCheck(username, password){
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err) throw err;
        const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
        collection.findOne({username:username, password:password}, function(err, result){
            if(err) throw err;
            client.close();
            return !!result;
        });
    });
}
function newUsername(username, password){
    if(usernameExist(username)) return false;
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err) throw err;
        const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
        var obj = startedDocument;
        obj.username = username;
        obj.password = password;
        collection.insertOne(obj, function(err, res){
            if(err) throw err;
            client.close();
            return true;
        });
    });
}
function usernameExist(username){
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err) throw err;
        const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
        collection.findOne({username:username}, function(err, result){
            if(err) throw err;
            client.close();
            return result;
        });
    });
}
function updateByUsername(username, key, value){
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err) throw err;
        const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
        const query = {username: username};
        const update = { $set: {[key]: value} };
        collection.findOne({username:username}, function(err, result){
            if(err) throw err;
            client.close();
            return result;
        });
    });
}