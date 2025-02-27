const WebSocket = require('ws');
const Store = require('../models/Store');

function initializeWebSocket(server) {
    const wss = new WebSocket.Server({ server });
    
    // Separate client tracking for each store type
    const clients = {
        public: new Set(),
        airbnb: new Set()
    };

    wss.on('connection', (ws) => {
        console.log('New client connected');
        ws.isAlive = true;

        ws.on('message', async (message) => {
            const data = JSON.parse(message);
            if (data.type === 'GET_STORE_STATE') {
                // Add client to appropriate store type group
                const storeType = data.storeType || 'public';
                ws.storeType = storeType;
                clients[storeType].add(ws);

                const store = await Store.findOne({ type: storeType });
                ws.send(JSON.stringify({
                    type: 'STORE_STATUS_UPDATE',
                    state: store ? store.state : 'closed',
                    storeType: storeType
                }));
            }
        });

        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        ws.on('close', () => {
            if (ws.storeType) {
                clients[ws.storeType].delete(ws);
            }
            console.log('Client disconnected');
        });
    });

    const broadcastStoreStatus = (storeStatus) => {
        const targetClients = clients[storeStatus.storeType] || clients.public;
        targetClients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'STORE_STATUS_UPDATE',
                    state: storeStatus.state,
                    storeType: storeStatus.storeType
                }));
            }
        });
    };

    const interval = setInterval(() => {
        [...clients.public, ...clients.airbnb].forEach((ws) => {
            if (!ws.isAlive) {
                if (ws.storeType) {
                    clients[ws.storeType].delete(ws);
                }
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on('close', () => {
        clearInterval(interval);
    });

    return { 
        broadcastStoreStatus,
        wss
    };
}

module.exports = initializeWebSocket;