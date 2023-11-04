
import { Chess } from "chess.js";
import { connectToServer, createGame, onMove, onConnect, onGameOver, onJoin } from "./ws.js";
import { getMove } from "./engine.js";
let position = null;
const COLOR = "w";
const INITIAL_FEN = "7q/4pnk1/4prn1/5pp1/1PP5/1NRP4/1KNP4/Q7 b - - 0 1";
const TIMES = [300_000, 300_000];
const INCREMENTS = [2000, 2000];
const results = [0, 0, 0];
const getName = () => `Laserfish BOT (${results[0]}w/${results[1]}d/${results[2]}l)`;
let isComputerTurn = COLOR === "w" ? false : true;

const makeGameWithSettings = () => createGame({
    fen: INITIAL_FEN,
    name: getName(),
    times: TIMES,
    increments: INCREMENTS,
    color: COLOR
});

onMove((moveObject, makeMove, resign) => {
    isComputerTurn = !isComputerTurn;
    if(isComputerTurn) {
        const piece = position.get(moveObject.move[0]);
        position.remove(moveObject.move[0]);
        position.put(piece, moveObject.move[1]);
        position.changeTurn();
        const move = getMove(position, COLOR);
        const piece2 = position.get(move[0]);
        position.remove(move[0]);
        position.put(piece2, move[1]);
        position.changeTurn();
        const fen = position.fen();
        move ? makeMove(move, fen, getName()) : resign();
    }
});

onConnect(() => {
    makeGameWithSettings();
});

onGameOver((winner) => {
    makeGameWithSettings();
    position = null;
    if(winner === "d") {
        results[1]++;
    } else if(winner === COLOR) {
        results[0]++;
    } else {
        results[2]++;
    }
})

onJoin((joinObject) => {
    position = new Chess(joinObject.fen, true);
})

connectToServer();