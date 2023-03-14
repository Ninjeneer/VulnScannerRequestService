import { UserToken } from "../../src/models/user";

declare module 'fastify' {
    export interface FastifyRequest {
        user?: UserToken
    }
}





