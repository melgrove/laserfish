"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionToFen = exports.fenToPosition = exports.newPositionFromMove = exports.getResult = exports.getLegalMoves = void 0;
const diagonalChangeCoords = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
const horizontalVerticalChangeCoords = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const knightChangeCoords = [[-2, -1], [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2]];
const whiteWinSquares = ["88", "87", "86", "85", "78", "68", "58"]; // ["h8", "h7", "h6", "h5", "g8", "f8", "e8"]
const blackWinSquares = ["11", "12", "13", "14", "21", "31", "41"]; // ["a1", "a2", "a3", "a4", "b1", "c1", "d1"]
function squareTranslation(initial, XYChange) {
    const x = parseInt(initial[0]);
    const y = parseInt(initial[1]);
    const newY = y + XYChange[1];
    const newX = x + XYChange[0];
    if (newY <= 8 && newY >= 1 && newX <= 8 && newX >= 1) {
        return `${newX}${newY}`;
    }
    else {
        return null;
    }
}
function getSquaresBetween(orig, dest) {
    // console.log(orig)
    // console.log(dest)
    const squares = [];
    const origX = parseInt(orig[0]);
    const origY = parseInt(orig[1]);
    const destX = parseInt(dest[0]);
    const destY = parseInt(dest[1]);
    const signX = destX > origX ? 1 : -1;
    const signY = destY > origY ? 1 : -1;
    const direction = [signX, signY];
    // console.log(orig)
    // console.log(direction)
    let newSquare = squareTranslation(orig, direction);
    while (newSquare !== dest) {
        squares.push(newSquare);
        newSquare = squareTranslation(newSquare, direction);
    }
    return squares;
}
function getLegalMoves(position, turn) {
    const dests = [];
    for (let square in position) {
        const piece = position[square];
        // Only find for current player turn
        if (piece[1] !== turn)
            continue;
        switch (piece[0]) {
            // Rook, Knight, and King have the same move mechanics as chess
            // Standard Rook
            case "r":
                for (let direction of horizontalVerticalChangeCoords) {
                    let currentPos = squareTranslation(square, direction);
                    while (currentPos !== null) {
                        if (!(currentPos in position)) {
                            // Empty square, add and check next
                            dests.push([square, currentPos, false]);
                            currentPos = squareTranslation(currentPos, direction);
                        }
                        else {
                            // Square has a piece, add if it's an opponent piece and stop
                            if (position[currentPos][1] !== turn) {
                                dests.push([square, currentPos, false]);
                            }
                            break;
                        }
                    }
                }
                break;
            // Standard knight
            case "n":
                knightChangeCoords
                    .map(e => squareTranslation(square, e))
                    .filter(e => e !== null && (!(e in position) || position[e][1] !== turn))
                    .forEach(e => dests.push([square, e, false]));
                break;
            // Standard king allowing moving into check
            case "k":
                [...diagonalChangeCoords, ...horizontalVerticalChangeCoords]
                    .map(e => squareTranslation(square, e))
                    .filter(e => e !== null && (!(e in position) || position[e][1] !== turn))
                    .forEach(e => dests.push([square, e, false]));
                break;
            // Pawns have inverted moving / capturing
            case "p":
                // Diagonals
                diagonalChangeCoords
                    .map(e => squareTranslation(square, e))
                    .filter(e => e !== null && !(e in position))
                    .forEach(e => dests.push([square, e, false]));
                // Verticals and horizontals
                horizontalVerticalChangeCoords
                    .map(e => squareTranslation(square, e))
                    .filter(e => e !== null && e in position && position[e][1] !== turn)
                    .forEach(e => dests.push([square, e, false]));
                break;
            // Laser moves like a rook but cannot take pieces, and shoots down the diagonal
            case "q":
                // Rook moves without taking
                for (let direction of horizontalVerticalChangeCoords) {
                    let currentPos = squareTranslation(square, direction);
                    while (currentPos !== null && !(currentPos in position)) {
                        dests.push([square, currentPos, false]);
                        currentPos = squareTranslation(currentPos, direction);
                    }
                }
                // Diagonal laser moves
                for (let direction of diagonalChangeCoords) {
                    let prevPos = square;
                    let currentPos = squareTranslation(square, direction);
                    let isValidDirection = false;
                    while (currentPos !== null && (!(currentPos in position) || position[currentPos][0] !== "r")) {
                        isValidDirection = true;
                        prevPos = currentPos;
                        currentPos = squareTranslation(currentPos, direction);
                    }
                    if (isValidDirection) {
                        dests.push([square, prevPos, true]);
                    }
                }
                break;
        }
    }
    return dests;
}
exports.getLegalMoves = getLegalMoves;
function getResult(position) {
    // Check for win condition
    let kings = new Set();
    for (let square in position) {
        if (position[square][0] === "k") {
            kings.add(position[square][1]);
        }
    }
    // both kings lasered at same time
    if (kings.size === 0) {
        return "d";
    }
    if (!kings.has("w")) {
        return "b";
    }
    if (!kings.has("b")) {
        return "w";
    }
    // Pawn reached other side
    for (let square of whiteWinSquares) {
        if (square in position && position[square][0] === "p" && position[square][1] === "w") {
            return "w";
        }
    }
    for (let square of blackWinSquares) {
        if (square in position && position[square][0] === "p" && position[square][1] === "b") {
            return "b";
        }
    }
    // Insufficient material check
    const squareValues = Object.values(position);
    if (squareValues.length <= 3) {
        // We know that there are two kings, so if a knight exists it's over
        if (squareValues.length === 2 || squareValues.map(piece => piece[0]).includes("n")) {
            return "d";
        }
    }
    // No 3 fold check for internal board
    return null;
}
exports.getResult = getResult;
function newPositionFromMove(position, move) {
    // console.log(position)
    if (move[2]) { // if laser
        delete position[move[1]];
        const squaresBetween = getSquaresBetween(move[0], move[1]);
        squaresBetween.forEach(square => {
            delete position[square];
        });
        return position;
    }
    else {
        position[move[1]] = position[move[0]];
        delete position[move[0]];
    }
    // console.log(position)
    return position;
}
exports.newPositionFromMove = newPositionFromMove;
function fenToPosition(fen) {
    const position = {};
    const fenArray = fen.split(' ');
    const board = fenArray[0].split('/');
    for (let n = 0; n < board.length; n++) {
        const rank = board[n];
        let file = 1;
        for (let item of rank.split('')) {
            const parsed = parseInt(item);
            if (isNaN(parsed)) {
                // Add piece to square
                const isWhite = item.toUpperCase() === item;
                position[`${file}${8 - n}`] = `${item.toLowerCase()}${isWhite ? 'w' : 'b'}`;
                file++;
            }
            else {
                // Add empty squares
                for (let i = 1; i <= parsed; i++) {
                    file++;
                }
            }
        }
    }
    return {
        position,
        turn: fenArray[1]
    };
}
exports.fenToPosition = fenToPosition;
function positionToFen(position, turn) {
    const fenArray = [];
    for (let m = 8; m >= 1; m--) {
        let emptySquareCount = 0;
        let rowString = '';
        for (let n = 1; n <= 8; n++) {
            if (`${n}${m}` in position) {
                if (emptySquareCount !== 0) {
                    rowString += emptySquareCount;
                    emptySquareCount = 0;
                }
                if (position[`${n}${m}`][1] === 'w') {
                    rowString += position[`${n}${m}`][0].toUpperCase();
                }
                else {
                    rowString += position[`${n}${m}`][0];
                }
            }
            else {
                emptySquareCount++;
            }
        }
        if (emptySquareCount !== 0) {
            rowString += emptySquareCount;
        }
        fenArray.push(rowString);
    }
    const fen = `${fenArray.join('/')} ${turn}`;
    console.log(fen);
    return fen;
}
exports.positionToFen = positionToFen;
