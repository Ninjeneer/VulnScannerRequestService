import { z } from "zod";
import { createScanRequest } from "./requests/scanRequest";
import Server from "./server";

export const setupRoutes = (server: Server) => {
    server.getFastify().post("/scans", async (req, res) => {
        try {
            const scanRequest = createScanRequest.parse(req.body);
            await server.getScanService().requestScan(scanRequest);
            // const report = await server.getScanService()
            res.status(200).send();
        } catch (e) {
            if (e instanceof z.ZodError) {
                res.status(400).send(e);
            } else {
                res.status(500).send(e);
            }
        }
    })
}