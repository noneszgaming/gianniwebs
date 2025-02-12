const WebSocket = require('ws');
const Store = require('../models/Store'); // Add this import


function initializeWebSocket(server) {
    const wss = new WebSocket.Server({ server });
    
    // Handle new connections
    wss.on('connection', (ws) => {
        console.log('New client connected');
        ws.isAlive = true;
        
        // Send initial store state
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
        ws.on('message', async (message) => {
            const data = JSON.parse(message);
            if (data.type === 'GET_STORE_STATE') {
                const store = await Store.findOne();
                ws.send(JSON.stringify({
                    type: 'STORE_STATUS_UPDATE',
                    state: store ? store.state : 'closed'
                }));
            }
        });
    });

    // Broadcast store status to all connected clients
    const broadcastStoreStatus = (storeStatus) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'STORE_STATUS_UPDATE',
                    state: storeStatus.state
                }));
            }
        });
    };

    // Keep connections alive with ping/pong
    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (!ws.isAlive) {
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    // Clean up on server close
    wss.on('close', () => {
        clearInterval(interval);
    });

    return { 
        broadcastStoreStatus,
        wss // Export WebSocket server instance
    };
}

module.exports = initializeWebSocket;
