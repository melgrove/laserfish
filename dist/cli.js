"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline/promises"));
// Create readline interface instance
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const laser_js_1 = require("./laser.js");
const INITIAL_FEN = "7q/4pnk1/4prn1/5pp1/1PP5/1NRP4/1KNP4/Q7 b - - 0 1";
const INITIAL_FEN2 = "5k1q/4pnk1/4prn1/5pp1/1PP5/1NRP4/1KNP4/Q7 b - - 0 1";
let { position, turn } = (0, laser_js_1.fenToPosition)(INITIAL_FEN);
console.log(position, turn);
console.log((0, laser_js_1.getResult)(position));
/*

while(true) {
    let [evaluation, move] = getMove(position, turn);
    console.log("Eval: " + evaluation);
    console.log("Move: " + move);

    let newPosition = newPositionFromMove(position, move);

    const userMoveFrom = await rl.question("Your move from: ");
    const userMoveTo = await rl.question("Your move to: ");
    const userMoveIsLaser = (await rl.question("is Laser? ")) === 'true';


    newPosition = newPositionFromMove(newPosition, [userMoveFrom, userMoveTo, userMoveIsLaser] as Dest);
    position = newPosition;
}


*/
