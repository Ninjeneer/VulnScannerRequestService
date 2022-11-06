import ScanService from "./service/scan/scanService";
import Server from "./service/server/server";
import SupabaseStorage from "./storage/scans/supabaseStorage";
import { config as loadLocalEnv } from "dotenv";
import AwsSqsQueue from "./storage/messagequeue/awsSqsQueue";
import { requireEnvVars } from "./utils";

if (process.env.NODE_ENV !== "production") {
    loadLocalEnv();
}

requireEnvVars([
    'AWS_DEFAULT_REGION',
    'AWS_ACCESS_KEY',
    'AWS_SECRET_KEY',
    'AWS_QUEUE_URL',
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'SERVER_PORT'
])

function bootstrap() {
    const scanService = new ScanService(new SupabaseStorage(), new AwsSqsQueue());
    const server = new Server(scanService);

    server.start();
}

bootstrap();