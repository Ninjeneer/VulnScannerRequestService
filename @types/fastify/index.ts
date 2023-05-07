import { User } from "../../src/models/user";

declare module 'fastify' {
    export interface FastifyRequest {
        user?: User
    }
}





