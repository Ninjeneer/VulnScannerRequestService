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

    server.getFastify().get('/probes', async (req, res) => {
        return [{
            name: 'probe-nmap',
            displayName: 'Scanner de vulnérabilités des services ouverts',
            description: 'Cette sonde va tenter d’dentifier tous les services ouverts sur le serveur cible, et de trouver des vulnérabilités connues associées à leur version.',
            type: 'Passive'
        }, {
            name: 'probe-nikto',
            displayName: 'Scanner de domaines sensibles exposés',
            description: 'Cette sonde va tenter de trouver les sous-domaines sensibles les plus connus, attachés au domaine cible.',
            type: 'Passive'
        }]
    })
}