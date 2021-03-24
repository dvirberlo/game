/**
 * scripts for the game
 * copyright Dvir Berlowitz 2020
 */

const canvas = $("#game")[0];
const ctx = canvas.getContext("2d");

// -------------------- websocket --------------------  
let ws = new WebSocket("ws://" + window.location.host);

// -------------------- draws --------------------
