const WebSocket = require('ws');

function initializeWebSocket(server) {
    const wss = new WebSocket.Server({ server });
    
    wss.on('connection', (ws) => {
        ws.isAlive = true;
        
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });

    // Broadcast store status to all connected clients
    const broadcastStoreStatus = (storeStatus) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'STORE_STATUS_UPDATE',
                    data: storeStatus
                }));
            }
        });
    };

    // Keep connections alive
    setInterval(() => {
        wss.clients.forEach((ws) => {
            if (!ws.isAlive) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    return { broadcastStoreStatus };
}

module.exports = initializeWebSocket;
