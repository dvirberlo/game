'use strict';

const canvas = $("canvas#game")[0];
const wsPath = "ws://" + window.location.host;

$.getScript("/scripts/dataManger.js");
$.getScript("/scripts/connectManger.js");
$.getScript("/scripts/canvasManger.js");