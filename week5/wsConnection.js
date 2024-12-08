const { WebSocketServer } = require('ws');

const connectedClients = new Set();

const initializeWebSocket = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('WebSocket Connection established');
        connectedClients.add(ws);
        ws.send('Welcome to the WebSocket server');

        ws.on('message', (message) => {
            console.log('Message received from a client so send it to everyone');
            connectedClients.forEach((client) =>{
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });

        ws.on('close', () => {
            console.log('WebSocket client connection closed');
            connectedClients.delete(ws);
        });

        ws.on('error', (error) => {
            console.error('WebSocket Error: ', error);
        });
    });

    console.log('WebSocket server initialized');
};

module.exports = { initializeWebSocket };
