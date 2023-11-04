import WebSocket from "isomorphic-ws";

// const WS_URL = "wss://api.playlaser.xyz";
const WS_URL = "ws://localhost:4321";

let moveHook = () => {};
let connectHook = () => {};
let gameOverHook = () => {};
let joinHook = () => {};
let socket = null;
let key = null;
let id = null;

export function createGame(options) {
    socket.send(JSON.stringify({
        messageType: "create",
        data: options,
    }));
}

function makeMove(move, fen, name) {
    socket.send(JSON.stringify({
        messageType: "move",
        data: {
            move,
            fen,
            name,
            key,
            id,
        },
    }))
}

export function connectToServer() {
    socket = new WebSocket(WS_URL);

    socket.addEventListener("open", () => {
        // ping every nine seconds to keep the connection alive (unclear how important this is)
        setInterval(() => {
            socket.send(JSON.stringify({
                messageType: "ping",
            }));
        }, 9_000);

        connectHook();
    });

    socket.addEventListener("error", () => {
        // gameOverHook();
    });

    socket.addEventListener("close", () => {
        // gameOverHook();
    });
      
    // receive a message from the server
    socket.addEventListener("message", ({ data }) => {
        const parsed = JSON.parse(data);
        console.log(parsed);
        switch (parsed.status) {
            case "moved":
                if(parsed.data.winner !== null) {
                    gameOverHook();
                } else {
                    moveHook(parsed.data, makeMove, () => {});
                }
                break;
            case "created":
                key = parsed.data.key;
                id = parsed.data.id;
                break;
            case "joined":
                joinHook(parsed.data);
                break;
            case "gameOver":
                gameOverHook();
                break;
        }
    });
}

// Hook setters
export function onMove(hook) {
    moveHook = hook;
}

export function onConnect(hook) {
    connectHook = hook;
}

export function onGameOver(hook) {
    gameOverHook = hook;
}

export function onJoin(hook) {
    joinHook = hook;
}