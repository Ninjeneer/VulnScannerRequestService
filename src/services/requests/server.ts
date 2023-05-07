import fastify from "fastify";
import cors from '@fastify/cors';
import { authMiddleware } from '../middlewares/authMiddleware'
import { createScanRequest, updateScanRequest } from "./validators/scanRequest";
import * as scanService from './scanService'
import { z } from 'zod'
import { config as loadLocalEnv } from "dotenv";
import { requireEnvVars } from "../../utils";
import { isProd } from "../../config";
if (!isProd) {
	loadLocalEnv();
}


requireEnvVars([
	'AWS_DEFAULT_REGION',
	'AWS_ACCESS_KEY',
	'AWS_SECRET_KEY',
	'AWS_QUEUE_REQUESTS_URL',
	'SUPABASE_URL',
	'SUPABASE_KEY',
	'SERVER_PORT'
])







const server = fastify();

server.register(cors, {
	origin: '*'
})
server.addHook('onRequest', authMiddleware)
server.listen({
	port: Number(process.env.SERVER_PORT),
	host: "0.0.0.0"
}, () => console.info(`HTTP Server started on port ${process.env.SERVER_PORT}`))


server.post("/scans", async (req, res) => {
	try {
		const scanRequest = createScanRequest.parse({ ...req.body as any, user_id: req.user.id });
		const scanId = await scanService.requestScan(scanRequest);
		res.status(202).send({ scanId });
	} catch (e) {
		if (e instanceof z.ZodError) {
			console.warn(e)
			res.status(400).send(e);
		} else {
			console.error(e)
			res.status(500).send(e);
		}
	}
})

server.patch('/scans/:id', async (req, res) => {
	try {
		const scanId = req.params['id']
		const updateRequest = updateScanRequest.parse({ ...JSON.parse(req.body as string) as any, user_id: req.user.id })
		const updatedScan = await scanService.updateScan(scanId, updateRequest)
		res.send('ok')
	} catch (e) {
		if (e instanceof z.ZodError) {
			console.warn(e)
			res.status(400).send(e);
		} else {
			console.error(e)
			res.status(500).send(e);
		}
	}
})

server.get('/probes', async (req, res) => {
	const probes = [{
		name: 'probe-nmap',
		description: 'Cette sonde va tenter d’dentifier tous les services ouverts sur le serveur cible, et de trouver des vulnérabilités connues associées à leur version.',
		type: 'Passive'
	}, {
		name: 'probe-nikto',
		description: 'Cette sonde va tenter de trouver les sous-domaines sensibles les plus connus, attachés au domaine cible.',
		type: 'Passive'
	}]

	if (!isProd) {
		probes.push({
			name: 'probe-dummy',
			description: 'Dummy probe for dev',
			type: 'Passive'
		})
	}
	return probes
})
