// CLI Access to BOT
// For debug only

/*
import * as readline from 'readline/promises';
import { Dest } from './laser.js';

// Create readline interface instance
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

import { getMove } from './engine.js';
import { fenToPosition, getResult, newPositionFromMove } from './laser.js';

const INITIAL_FEN = "7q/4pnk1/4prn1/5pp1/1PP5/1NRP4/1KNP4/Q7 b - - 0 1";
const INITIAL_FEN2 = "5k1q/4pnk1/4prn1/5pp1/1PP5/1NRP4/1KNP4/Q7 b - - 0 1";

let { position, turn } = fenToPosition(INITIAL_FEN);

console.log(position, turn)
console.log(getResult(position))


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

