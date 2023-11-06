import { getLegalMoves, getResult, newPositionFromMove, Dest, Position, Color, fenToPosition, positionToFen } from "./laser";
import { blackPawnWinLookup, whitePawnWinLookup, pawnWinRewardLookup, materialLookup } from "./engineLookups";

let MAX = 10000;
let MIN = -10000;

export function getMove(fen: string, MAX_DEPTH: number = 4): Array<any> {
    const { position, turn } = fenToPosition(fen);
    const startTime = Date.now();
    const res = minimax(0, position, turn, true, MIN, MAX, true, MAX_DEPTH);
    console.log(`Took ${((Date.now() - startTime)/1000).toFixed(2)}s`);
    const newPosition = newPositionFromMove(position, res[1]);
    const newFen = positionToFen(newPosition, turn === 'w' ? 'b' : 'w');
    return [...res as Array<any>, newFen];
}

function evaluation(position: Position, playerColor: Color) {
    // First check for win or loss
    const result = getResult(position);
    if(result !== null) {
        if(result === "w") return playerColor === 'b' ? MIN : MAX;
        if(result === "b") return playerColor === 'b' ? MAX : MIN;
        return 0; // implicit draw result === 'd'
    }
    // No result so count material
    let material = 0;
    for(let square in position) {
        if(position[square][1] === 'w') {
            material += materialLookup[position[square][0] as string];
            if(position[square][0] === 'p') {
                material += pawnAdvancementAdjustment(square, 'w');
            }
        } else {
            material -= materialLookup[position[square][0] as string];
            if(position[square][0] === 'p') {
                material -= pawnAdvancementAdjustment(square, 'b');
            }
        }
    };

    return playerColor === 'b' ? -material : material;
}

function pawnAdvancementAdjustment(square: string, color: Color): number {
    if(color === 'w') {
        const distanceFromWinning = whitePawnWinLookup[square];
        return pawnWinRewardLookup[distanceFromWinning];
    } else {
        const distanceFromWinning = blackPawnWinLookup[square];
        return pawnWinRewardLookup[distanceFromWinning];
    }
}

function getNewPosition(oldPosition, move): Position {
    let newPosition = {};
    newPosition = Object.assign({}, oldPosition);
    newPosition = newPositionFromMove(newPosition, move);
    return newPosition;
}

function minimax(
    depth: number, 
    position: Position, 
    turn: Color,
    maximizingPlayer: boolean, 
    alpha: number, 
    beta: number, 
    topLevel: boolean,
    MAX_DEPTH: number)
{
    if (depth == MAX_DEPTH) {
        return evaluation(position, turn);
    }

    const result = getResult(position);
    if(result !== null) {
        if(result === 'w') return turn === 'b' ? MIN : MAX;
        if(result === 'b') return turn === 'b' ? MAX : MIN;
        return 0; // implicit draw result === 'd'
    }

    if (maximizingPlayer) {
        let best: number = MIN;
        let bestMove = null;
        
        const legalMovesLookup = getLegalMoves(position, turn);
        for (let move of legalMovesLookup) {
            const newPosition = getNewPosition(position, move);
            let score = minimax(depth + 1, newPosition, turn, false, alpha, beta, false, MAX_DEPTH);
            if (score as number > best) {
                best = score as number;
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
        } else {
            return best;
        }

    } else {
        let best = MAX;
   
        const legalMovesLookup = getLegalMoves(position, turn === 'b' ? 'w' : 'b');
        for (let move of legalMovesLookup) {
            const newPosition = getNewPosition(position, move);
            let score = minimax(depth + 1, newPosition, turn, true, alpha, beta, false, MAX_DEPTH);

            if (score as number < best) {
                best = score as number;
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