'use strict';
// database
const MongoDB = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "magicbamba";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "herokutest";
const startedDocument = {
    username:"",
    password:"",
    magicType:0,
    xp:0,
    resources:{a:10, b:5, c:5},
    ownedSpells:[],
    ownedClothes:[],
    mission:false
};

// express
const express  = require("express"),
path = require("path"),
PORT = process.env.PORT || 5000;

// websocket
const WebSocket = require('ws');
const maxMsgLenght = 1000;

const codesTable = {
    login         : 0,
    getData       : 1,
    missionMove   : 2,
    missionQuit   : 3,
    enterMission  : 4,
    updateClothes : 5,
    updateSpell   : 6,
    gameMode      : 7
};


// ----- start express -----
const server = express()
    .use(express.static(path.join(__dirname, "public")))
    .set("views", path.join(__dirname, "views"))
    .set("view engine", "ejs")
    .get("/", (req, res)=> res.render("index"))
    .get("/game", (req, res)=> res.render("game"))
    .get("/usernameCheck", usernameCheckRequest)
    .get("/signup", signupRequest)
    .listen(PORT, ()=>console.log(`Liseting on ${PORT}`));
process.on("exit", code=> console.log(`About to exit with code ${code}`));

// /usernameCheck request
function usernameCheckRequest(req, res){
    // invalid username act as exist
    if(!usernameValid(req.query.username)) res.json(false);
    // return the opposit: if this usernmae already exists (exist- false, unexist- true)
    else readByUsername(req.query.username, result=> res.json(!result));
}
// /signup request
function signupRequest(req, res){
    // if invalid- response failue
    if(!inputsValid(req.query.username, req.query.password)){
        res.json(false);
    }
    //else- create new user
    else newUser(req.query.username, req.query.password, result=> {
        res.json(result);
    });
}

// ----- start websocket -----
const wss = new WebSocket.Server({server});
wss.on("connection", (ws, req, client)=>{
    // on connection send codes table
    wsSend(codesTable, ws);
    
    // open ws for requests
    ws.isActive = true;

    ws.on("message", (msg)=>{
        // check if opened to requests
        if(!ws.isActive) return false;

        // check if message is not too long
        let message = msg.toString();
        if(message.length > maxMsgLenght){
            // LOGDEV
            wsSend("maxMsgLenght", ws);
            return ws.terminate();
        }
        // parse message
        message = wsParse(message);
        // disable react requests till there is a response
        ws.isActive = false;
        // callback with response
        wsSwitchCodes(message, ws, (res)=>{
            // send the response with the request code
            wsSend({code: message.code, response: res}, ws);
            // reopen ws for requests
            ws.isActive = true;
        });
    });
    ws.on("close", ()=>{
		//on close
    });
});
function wsSwitchCodes(message, ws, callback){
    switch(message.code){
        case codesTable.login:
            loginRequest(message.username, message.password, callback);
            break;
    }
}
function loginRequest(username, password, callback){
    if(inputsValid(username, password)) loginCheck(username, password, callback);
    else callback(false);
}
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
let dbCollection = null;
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
        callback(!!result);
    });
}
function newUser(username, password, callback){
    readByUsername(username, result=>{
        if(result) callback(false);
        else{
            let obj = startedDocument;
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
function setByUsername(username, key, value, callback){
    const query = {username: username};
    const update = { $set: {[key]: value} };

    if(!dbCollection) throw "dbCollection is not defined";
    dbCollection.updateOne(query, update, function(err, res) {
        if(err) throw err;
        callback(true);
    });
}
function addByUsername(username, key, item, callback){
    // TODO
}