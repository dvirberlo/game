'use strict';
// database
const MongoDB = require('mongodb');
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
    // invalid username act as unavailable
    if(!usernameValid(req.query.username)) return res.json(codes.exist);

    readByUsername(req.query.username, result=> res.json(result? codes.usernameCheck.exist: codes.usernameCheck.unexist));
}


// ----- start websocket -----
const wss = new WebSocket.Server({server});
wss.on("connection", (ws, req, client)=>{
    let wsActive = true;

    ws.on("message", (msg)=>{
        if(!wsActive) return false;
        var message = msg.toString();
        if(message.length > maxMsgLenght){
            wsSend({code:codes.error}, ws);
            return ws.terminate();
        }
        message = wsParse(message);
        switch(message.code){
            case codes.login.request:
                wsActive = false;
                loginCheck(message.username, message.password, result=> {
                    if(result) wsSend({code:codes.logged.success}, ws);
                    else wsSend({code:codes.login.fail}, ws);
                    wsActive = true;
                });
                break;
            case codes.signup.request:
                // if invalid- send fail
                if(!inputsValid(message.username, message.password)){
                    wsSend({code:codes.signup.fail} ,ws);
                    break;
                }
                wsActive = false;
                // LOGDEV
                console.log("signup request: " + JSON.stringify({username:message.username, password:message.password}));
                newUser(message.username, message.password, result=> {
                    if(result) wsSend({code:codes.signup.success}, ws);
                    else wsSend({code:codes.signup.fail}, ws);
                    wsActive = true;
                });
                break;
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
// --- validation functions: ---
function inputsValid(username, password){
    return usernameValid(username) && passwordValid(password);
}
function usernameValid(username){
    return username.length > 0 && username.length < 50;
}
function passwordValid(password){
    return password.length > 0 && password.length < 50;
}


// ----- database functions -----
var dbCollection = null;
function connectDB(){
    const client = new MongoDB.MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err) throw err;
        const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
        dbCollection = collection;

    });
}
connectDB();

function loginCheck(username, password, callback){
    if(!dbCollection) throw "dbCollection is not defined";

    dbCollection.findOne({username:username, password:password}, function(err, result){
        if(err) throw err;
        callback(!!result._id);
    });
}
function newUser(username, password, callback){
    readByUsername(username, result=>{
        if(result) callback(false);
        else{
            var obj = startedDocument;
            obj.username = username;
            obj.password = password;
            obj._id = new MongoDB.ObjectID();

            if(!dbCollection) throw "dbCollection is not defined";
            dbCollection.insertOne(obj, function(err, res){
                if(err) throw err;
                // LOGDEV
                console.log("newUser: " + JSON.stringify({username:username, password:password, res:res}));
                callback(true);
            });
        }
    });
}
function readByUsername(username, callback){
    if(!dbCollection) throw "dbCollection is not defined";

    dbCollection.findOne({username:username}, function(err, result){
        if(err) throw err;
        // LOGDEV
        console.log("readByUsername: " + JSON.stringify({username:username, result:result}));
        callback(result);
    });
}
function updateByUsername(username, key, value, callback){
    const query = {username: username};
    const update = { $set: {[key]: value} };

    if(!dbCollection) throw "dbCollection is not defined";
    dbCollection.updateOne(query, update, function(err, res) {
        if(err) throw err;
        callback(true);
    });
}