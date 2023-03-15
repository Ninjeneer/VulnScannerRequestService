import { User } from "@supabase/supabase-js";

declare module 'fastify' {
    export interface FastifyRequest {
        user?: User
    }
}





