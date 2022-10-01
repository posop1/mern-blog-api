import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import console from 'console';

import routers from './routes/index.js';

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

const connectDataBase = async () => {
	try {
		mongoose.connect(process.env.DATABASE_URL);
		console.log('Connected to DataBase');
	} catch (e) {
		console.log(e);
	}
};

mongoose.connection.on('disconnected', () => {
	console.log('mongoDB disconnected');
});
mongoose.connection.on('connected', () => {
	console.log('mongoDB connected');
});

//midlewares
app.use(express.json());
app.use(cors());

//routes
app.use('/api', routers);

async function startApp() {
	try {
		app.listen(port, () => {
			console.log(`Server listening on ${port}`);
			connectDataBase();
		});
	} catch (e) {
		console.log(e);
	}
}

startApp();
