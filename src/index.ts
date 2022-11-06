import ScanService from "./service/scan/scanService";
import Server from "./service/server/server";
import SupabaseStorage from "./storage/scans/supabaseStorage";
import { config as loadLocalEnv } from "dotenv";

loadLocalEnv();

function bootstrap() {
    const scanService = new ScanService(new SupabaseStorage());
    const server = new Server(scanService);

    server.start();
}

bootstrap();