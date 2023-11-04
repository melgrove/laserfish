import { Chess } from "chess.js";
import { getLegalMoves, getResult } from "./laser.js";
const materialLookup = {
    "p": 1,
    "n": 2,
    "r": 6.1,
    "q": 6,
};

export function getMove(position, color) {
    const legalMovesMap = getLegalMoves(position);
    // Alpha-beta minimax, depth 4
    let alpha = -1000;
    let beta = 1000;
    const depth = 2;
    let bestMove = null;
    let bestEval = -Infinity;
    for(let pair of legalMovesMap) {
        for(let dest of pair[1]) {
            let newPosition = new Chess(position.fen(), true);
            const piece = newPosition.get(pair[0]);
            newPosition.remove(pair[0]);
            newPosition.put(piece, dest);
            newPosition.changeTurn();
            const evaluation = alphaBeta(newPosition, color, alpha, beta, depth);
            console.log(`${pair[0] + dest}: ${evaluation}`);
            if(evaluation > bestEval) {
                bestMove = [pair[0], dest];
                bestEval = evaluation;
            }
        }
    }
    return bestMove;
}

function evaluation(position, color) {
    // First check for win or loss
    const result = getResult(position);
    if(result === "d") return 0;
    if(result === "w") return color === "w" ? 1000 : -1000;
    if(result === "b") return color === "b" ? 1000 : -1000;
    // No result so count material
    let material = 0;
    position.board().forEach(file => file.forEach(square => {
        if(square) {
            if(square.color === color) {
                material += materialLookup[square.type];
            } else {
                material -= materialLookup[square.type];
            }
        }
    }));
    return material;
}

function alphaBeta(position, color, alpha, beta, depth) {
    if(depth === 0) return evaluation(position, color);
    const legalMovesMap = getLegalMoves(position);
    for(let pair of legalMovesMap) {
        for(let dest of pair[1]) {
            let newPosition = new Chess(position.fen(), true);
            const piece = newPosition.get(pair[0]);
            newPosition.remove(pair[0]);
            newPosition.put(piece, dest);
            newPosition.changeTurn();
            const score = -alphaBeta(newPosition, color, -beta, -alpha, depth - 1);
            if(score >= beta) {
                return beta;
            }
            if(score > alpha) {
                alpha = score;
            }
        }
    }
    return alpha;
}