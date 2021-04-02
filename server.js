'use strict';
// database
const MongoDB = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "magicbamba";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "herokutest";
const startedDocument = {
    _id:null,
    username:"",
    password:"",
    magicType:0,
    xp:0,
    resources:{lights:10, gems:5, flowers:5},
    spells:[],
    clothes:[],
    mission:false
};
const data = {
    spells: [{name: "fireball", price:{lights:0, gems:5, flowers:5}}],
    clothes: [{name: "hat", price:{lights:10, gems:0, flowers:0}}]
};
/**
 * TODO: any type of simple the queryUpdate system (queryUpdate table/function).
 * till then- there are the basics:
 * push item in array:  update= {$push: {[array]: value}}
 * set value of object: update= {$set: {[object.key]: value}}
 * 
 * set value of objet in array by objId: 
 *      query= {username: username, array.objId: objId} update= {$set: {array.$.key: value}}
 * 
 */

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
    quitMission   : 3,
    enterMission  : 4,
    buyClothes    : 5,
    equipClothes  : 6,
    buySpell      : 7,
    equipSpell    : 8,
    gameMode      : 9,
    enterBattle   :10,
    battleAttack  :11,
    quitBattle     :12
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
    // ws was not logged in yet
    ws.username = false;

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
            loginRequest(message.username, message.password, ws, callback);
        break;

        case codesTable.getData:
            getDataRequest(ws, callback);
        break;
        // mission and battle: enter and quit
        case codesTable.setMission:
            gameUpdate("mission", message.request, ws, callback);
        break;
        case codesTable.setBattle:
            gameUpdate("mission.battle", message.request, ws, callback);
        break;
        // updates
        case codesTable.missionMove:
            gameUpdate("mission.cell", message.request, ws, callback);
        break;
        case codesTable.battleAttack:
            gameUpdate("mission.battle.state", message.request, ws, callback);
        break;
        // buy
        case codesTable.buyClothes:
            buyItemRequest(message.request, "clothes", ws, callback);
        break;
        case codesTable.buySpell:
            buyItemRequest(message.request, "spells", ws, callback);
        break;
        // un/equip
        case codesTable.equipClothes:
            equipItemRequest(message.request.id, message.request.value, "clothes", callback);
        break;
        case codesTable.equipSpell:
            equipItemRequest(message.request.id, message.request.value, "spells", callback);
        break;
    }
}
function loginRequest(username, password, ws, callback){
    if(inputsValid(username, password)) loginCheck(username, password, result=>{
        // if login succeeded- save username: means ws logged in.
        if(result){
            ws.username = username;
        }
        callback(result);
    });
    else callback(false);
}
function getDataRequest(ws, callback){
    const username = ws.username;
    // only if logged in- send the data
    if(username) readByUsername(username, callback);
    else callback(false);
}
function buyItemRequest(id, type, ws, callback){
    const username = ws.username;
    // only if logged in- buy item
    if(username) checkAfford(username, data[type][id].price, (result, newResources)=>{
        // only if affordable
        if(result){
            // add item to list
            const newItem = {id: id, equip: false};
            updateByUsername({username: username}, {$push:{[type]: newItem}}, callback);
            // decrease price from resources and send new resources
            setByUsername(username, "resources", newResources, result=> {
                gameMode(ws, "resources", newResources);
            });
        }
        else callback(false);
    });
    else callback(false);
}
function equipItemRequest(id, value, type, ws, callback){
    const username = ws.username;
    // only if logged in- buy item
    if(username){
        // query: username && id.
        updateByUsername({username: username, [type+".id"]: id}, {$set:{[type+'.$.equip']: value}}, callback);
        // decrease price from resources and send new resources
        setByUsername(username, "resources", newResources, result=>{
            // result to boolean
            callback(!!result);
        });
    }
    else callback(false);
}


function gameMode(ws, key, value){
    wsSend({code: codesTable.gameMode, response: {key: key, value: value}}, ws);
}
function gameUpdate(path, value, ws, callback){
    const username = ws.username;
    // only if logged in- update
    if(username) setByUsername(username, path, value, callback);
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

    dbCollection.findOne({username:username, password:password}, (err, result)=>{
        if(err) throw err;
        // result to boolean
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
            dbCollection.insertOne(obj, (err, res)=>{
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

    dbCollection.findOne({username:username}, {projection: {_id:0}}, (err, result)=>{
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
    dbCollection.updateOne(query, update, (err, res)=>{
        if(err) throw err;
        callback(true);
    });
}
function updateByUsername(query, update, callback){
    if(!dbCollection) throw "dbCollection is not defined";
    dbCollection.updateOne(query, update, (err, res)=>{
        if(err) throw err;
        callback(true);
    });
}

function checkAfford(username, price, callback){
    readByUsername(username, result=>{
        let resources = result.resources;
        let affordable = true;
        for(let key in resources){
            resources[key] -= price[key];
            affordable = affordable && resources[key] >= 0;
        }
        callback(affordable, resources);
    });
}
