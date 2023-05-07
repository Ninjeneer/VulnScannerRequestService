import fastify from "fastify";
import cors from '@fastify/cors';
import { authMiddleware } from '../middlewares/authMiddleware'
import { ZodError } from 'zod'
import { config as loadLocalEnv } from "dotenv";
import { requireEnvVars } from "../../utils";
import { ReportDoesNotExist } from "../../exceptions/exceptions";
import { getMongoReportById, rebuildReport } from "./reportService";
import { getReportByIdRequest, getSupabaseReportByIdRequest } from "./validators/reportRequests";
import { connect } from "mongoose";
import { initResponsesQueue } from "./probeResultService";
import { isProd } from "../../config";
if (!isProd) {
    loadLocalEnv();
}


requireEnvVars([
    'AWS_DEFAULT_REGION',
    'AWS_ACCESS_KEY',
    'AWS_SECRET_KEY',
    'AWS_QUEUE_RESPONSES_URL',
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'SERVER_PORT',
    'MONGO_COLLECTION',
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
    initResponsesQueue()
    
    const server = fastify();

    server.register(cors, {
        origin: '*'
    })
    server.addHook('onRequest', authMiddleware)
    server.listen({
        port: Number(process.env.SERVER_PORT),
        host: "0.0.0.0"
    }, () => console.info(`HTTP Server started on port ${process.env.SERVER_PORT}`))


    server.get("/reports/:id", async (req, res) => {
        try {
            const reportId = getReportByIdRequest.parse(req.params['id']);
            const report = await getMongoReportById(reportId);
            res.status(200).send(report);
        } catch (e) {
            if (e instanceof ReportDoesNotExist) {
                res.status(404).send(e.message)
            } else if (e instanceof ZodError) {
                res.status(400).send('Invalid ID')
            } else {
                res.status(500).send(e);
            }
        }
    })

    server.post("/reports/:id/rebuild", async (req, res) => {
        try {
            const reportId = getSupabaseReportByIdRequest.parse(req.params['id']);
            await rebuildReport(reportId)
            res.status(200).send();
        } catch (e) {
            if (e instanceof ReportDoesNotExist) {
                res.status(404).send(e.message)
            } else if (e instanceof ZodError) {
                res.status(400).send('Invalid ID')
            } else {
                res.status(500).send(e);
            }
        }
    })
}
