import fastify from "fastify";
import cors from '@fastify/cors';
import { authMiddleware } from '../middlewares/authMiddleware'
import { config as loadLocalEnv } from "dotenv";
import { requireEnvVars } from "../../utils";
import { getStatsForUser } from "./stats.service";
import { connect } from "mongoose";
if (process.env.NODE_ENV !== "production") {
	loadLocalEnv();
}


requireEnvVars([
	'SUPABASE_URL',
	'SUPABASE_KEY',
	'SERVER_PORT',
	'MONGO_URL',
    'MONGO_DB'
])




try {
	console.info('Connecting to MongoDB...');
	connect(process.env.MONGO_URL, {
		dbName: process.env.MONGO_DB
	})
		.then(() => {
			console.info('Connected to MongoDB');
			startServer()
		})
		.catch(console.error)
} catch (e) {
	console.error('Failed to connect to MongoDB', e);
}

const startServer = () => {
	const server = fastify();

	server.register(cors, {
		origin: '*'
	})
	server.addHook('onRequest', authMiddleware)
	server.listen({
		port: Number(process.env.SERVER_PORT),
		host: "0.0.0.0"
	}, () => console.info(`HTTP Server started on port ${process.env.SERVER_PORT}`))

	server.get('/users/:id', async (req, res) => {
		try {
			const userId = req.params['id']
			const userStats = await getStatsForUser(userId)
			return userStats
		} catch (e) {
			console.error(e)
			res.status(500).send()
		}

	})
}


