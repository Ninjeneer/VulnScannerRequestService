import fastify, { FastifyInstance } from "fastify";
import cors from '@fastify/cors';

import ScanService from "../scan/scanService";
import { setupRoutes } from "./router";
import { authMiddleware } from "./middlewares/authMiddleware";

export default class Server {
    private fastify: FastifyInstance;

    constructor(private readonly scanService: ScanService) {
        this.fastify = fastify();
        this.fastify.register(cors, {
            origin: '*'
        });
        this.fastify.addHook('onRequest', authMiddleware)
        setupRoutes(this);
    }

    public async start() {
        console.info('Starting HTTP server...');
        await this.fastify.listen({
            port: Number(process.env.SERVER_PORT),
            host: "0.0.0.0"
        })
        console.info(`HTTP Server started on port ${process.env.SERVER_PORT}`)
    }

    public getScanService(): ScanService {
        return this.scanService;
    }

    public getFastify(): FastifyInstance {
        return this.fastify;
    }
}
