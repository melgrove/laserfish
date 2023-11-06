"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMove = void 0;
const laser_1 = require("./laser");
const engineLookups_1 = require("./engineLookups");
let MAX = 10000;
let MIN = -10000;
function getMove(fen, MAX_DEPTH = 4) {
    const { position, turn } = (0, laser_1.fenToPosition)(fen);
    const startTime = Date.now();
    const res = minimax(0, position, turn, true, MIN, MAX, true, MAX_DEPTH);
    console.log(`Took ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
    const newPosition = (0, laser_1.newPositionFromMove)(position, res[1]);
    const newFen = (0, laser_1.positionToFen)(newPosition, turn === 'w' ? 'b' : 'w');
    return [...res, newFen];
}
exports.getMove = getMove;
function evaluation(position, playerColor) {
    // First check for win or loss
    const result = (0, laser_1.getResult)(position);
    if (result !== null) {
        if (result === "w")
            return playerColor === 'b' ? MIN : MAX;
        if (result === "b")
            return playerColor === 'b' ? MAX : MIN;
        return 0; // implicit draw result === 'd'
    }
    // No result so count material
    let material = 0;
    for (let square in position) {
        if (position[square][1] === 'w') {
            material += engineLookups_1.materialLookup[position[square][0]];
            if (position[square][0] === 'p') {
                material += pawnAdvancementAdjustment(square, 'w');
            }
        }
        else {
            material -= engineLookups_1.materialLookup[position[square][0]];
            if (position[square][0] === 'p') {
                material -= pawnAdvancementAdjustment(square, 'b');
            }
        }
    }
    ;
    return playerColor === 'b' ? -material : material;
}
function pawnAdvancementAdjustment(square, color) {
    if (color === 'w') {
        const distanceFromWinning = engineLookups_1.whitePawnWinLookup[square];
        return engineLookups_1.pawnWinRewardLookup[distanceFromWinning];
    }
    else {
        const distanceFromWinning = engineLookups_1.blackPawnWinLookup[square];
        return engineLookups_1.pawnWinRewardLookup[distanceFromWinning];
    }
}
function getNewPosition(oldPosition, move) {
    let newPosition = {};
    newPosition = Object.assign({}, oldPosition);
    newPosition = (0, laser_1.newPositionFromMove)(newPosition, move);
    return newPosition;
}
function minimax(depth, position, turn, maximizingPlayer, alpha, beta, topLevel, MAX_DEPTH) {
    if (depth == MAX_DEPTH) {
        return evaluation(position, turn);
    }
    const result = (0, laser_1.getResult)(position);
    if (result !== null) {
        if (result === 'w')
            return turn === 'b' ? MIN : MAX;
        if (result === 'b')
            return turn === 'b' ? MAX : MIN;
        return 0; // implicit draw result === 'd'
    }
    if (maximizingPlayer) {
        let best = MIN;
        let bestMove = null;
        const legalMovesLookup = (0, laser_1.getLegalMoves)(position, turn);
        for (let move of legalMovesLookup) {
            const newPosition = getNewPosition(position, move);
            let score = minimax(depth + 1, newPosition, turn, false, alpha, beta, false, MAX_DEPTH);
            if (score > best) {
                best = score;
                if (topLevel) {
                    bestMove = move;
                }
            }
            if (best > alpha) {
                alpha = best;
            }
            // Alpha Beta Pruning
            if (beta <= alpha) {
                break;
            }
        }
        if (topLevel) {
            return [best, bestMove];
        }
        else {
            return best;
        }
    }
    else {
        let best = MAX;
        const legalMovesLookup = (0, laser_1.getLegalMoves)(position, turn === 'b' ? 'w' : 'b');
        for (let move of legalMovesLookup) {
            const newPosition = getNewPosition(position, move);
            let score = minimax(depth + 1, newPosition, turn, true, alpha, beta, false, MAX_DEPTH);
            if (score < best) {
                best = score;
            }
            if (best < beta) {
                beta = best;
            }
            // Alpha Beta Pruning
            if (beta <= alpha) {
                break;
            }
        }
        return best;
    }
}
