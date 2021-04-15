// Requires
require('dotenv').config();
const Server = require('./models/server');

// Class instance
const server = new Server();

// Port listening activation
server.listen();
