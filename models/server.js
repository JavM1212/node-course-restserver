const express = require('express');
const cors = require('cors');

class Server {
	constructor() {
		// Express config
		this.app = express();
		this.usersPath = '/api/users';

		// Port config
		this.port = process.env.PORT;

		// Middlewares
		this.middlewares();

		// App routes
		this.routes();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Read and body parse
		this.app.use( express.json() )

		// Public folder
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.usersPath, require('../routes/user'));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log('Server running at ', this.port);
		});
	}
}

module.exports = Server;
