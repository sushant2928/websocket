const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Dictionary to store connected clients
const connectedClients = {};

// Function to handle incoming messages from clients
wss.on('connection', function connection(ws) {
  // Assign a unique ID to each client
  const clientId = Date.now();
  connectedClients[clientId] = ws;

  // Send a welcome message to the newly connected client
  ws.send('Welcome to the chat!');

  // Handle incoming messages from the client
  ws.on('message', function incoming(message) {
    // Broadcast the received message to all connected clients
    broadcast(message);
  });

  // Function to broadcast messages to all connected clients
  function broadcast(message) {
    Object.values(connectedClients).forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Handle client disconnection
  ws.on('close', function close() {
    delete connectedClients[clientId];
  });
});
