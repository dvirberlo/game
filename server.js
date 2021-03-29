'use strict';
// database
const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB ="magicbamba";
const MONGODB_COLLECTION = "herokutest";
const startedDocument = {username:"", password:"", magicType:0, xp:0, resources:[10,0,0,0,0], ownedSpells:[], ownedClothes:[], state:{}};

// express
const express  = require("express"),
path = require("path"),
PORT = process.env.PORT || 5000;

// websocket
const WebSocket = require('ws');
const maxMsgLenght = 500;

const codes = {
    error:-1,
    login: {request:0, success:1, fail: 2},
    signup: {request:10, success:11, fail:12},
    usernameCheck: {exist:21, unexist:22}
};


// ----- start express -----
const server = express()
    .use(express.static(path.join(__dirname, "public")))
    .set("views", path.join(__dirname, "views"))
    .set("view engine", "ejs")
    .get("/", (req, res)=> res.render("index"))
    .get("/game", (req, res)=> res.render("game"))
    .get("/usernameCheck", usernameCheck)
    .listen(PORT, ()=>console.log(`Liseting on ${PORT}`));
process.on("exit", code=> console.log(`About to exit with code ${code}`));

function usernameCheck(req, res){
    readByUsername(req.query.username, result=> res.json(result? codes.usernameCheck.exist: codes.usernameCheck.unexist));
}


// ----- start websocket -----
const wss = new WebSocket.Server({server});
wss.on("connection", (ws, req, client)=>{
    //on connection

    ws.on("message", (msg)=>{
        var message = msg.toString();
        if(message.length > maxMsgLenght){
            wsSend({code:codes.error}, ws);
            return ws.terminate();
        }
        message = wsParse(message);
        switch(message.code){
            case codes.login.request:
                loginCheck(message.username, message.password, result=> {
                    if(result) wsSend({code:codes.logged.success}, ws);
                    else wsSend({code:codes.login.fail}, ws);
                });
                break;
            case codes.signup.request:
                newUser(message.username, message.password, result=> {
                    if(result) wsSend({code:codes.signup.success}, ws);
                    else wsSend({code:codes.signup.fail}, ws);
                });
        }
    });
    ws.on("close", ()=>{
		//on close
    });
});
function wsSend(obj, ws){
    // TODO: handle network issues
    if(ws.readyState === WebSocket.OPEN) ws.send(wsStringify(obj));
    else{
        // TODO
    }
}
function wsStringify(obj){
    return JSON.stringify(obj);
}
function wsParse(data){
    return JSON.parse(data);
}


// ----- database functions -----
function loginCheck(username, password, callback){
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err) throw err;
        const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
        collection.findOne({username:username, password:password}, function(err, result){
            if(err) throw err;
            client.close();
            callback(!!result._id);
        });
    });
}
function newUser(username, password, callback){
    readByUsername(username, result=>{
        if(result) callback(false);
        else{
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
                    callback(true);
                });
            });
        }
    });
}
function readByUsername(username, callback){
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err) throw err;
        const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
        collection.findOne({username:username}, function(err, result){
            if(err) throw err;
            client.close();
            callback(result);
        });
    });
}
function updateByUsername(username, key, value, callback){
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err) throw err;
        const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
        const query = {username: username};
        const update = { $set: {[key]: value} };
        collection.updateOne(query, update, function(err, res) {
            if(err) throw err;
            client.close();
            callback(true);
        });
    });
}