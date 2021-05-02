const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {
	constructor() {
		// Express config
		this.app = express();

		// Port config
		this.port = process.env.PORT;

		// Path config
		this.paths = {
			auth: '/api/auth',
			categories: '/api/categories',
			products: '/api/products',
			search: '/api/search',
			uploads: '/api/uploads',
			users: '/api/users',
		};

		// Connect to data base
		this.connectDB();

		// Middlewares
		this.middlewares();

		// App routes
		this.routes();
	}

	// Connect to DB
	async connectDB() {
		await dbConnection();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Read and body parse
		this.app.use(express.json());

		// Public folder
		this.app.use(express.static('public'));

		// File upload
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: '/tmp/',
				createParentPath: true,
			})
		);
	}

	// Defining routes
	routes() {
		this.app.use(this.paths.auth, require('../routes/auth'));
		this.app.use(this.paths.categories, require('../routes/categories'));
		this.app.use(this.paths.products, require('../routes/products'));
		this.app.use(this.paths.search, require('../routes/search'));
		this.app.use(this.paths.users, require('../routes/users'));
		this.app.use(this.paths.uploads, require('../routes/uploads'));
	}

	// Config port listening
	listen() {
		this.app.listen(this.port, () => {
			console.log('Server running at ', this.port);
		});
	}
}

module.exports = Server;
