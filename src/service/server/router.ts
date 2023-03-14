import { z } from "zod";
import { createScanRequest } from "./requests/scanRequest";
import Server from "./server";
import jsonwebtoken from 'jsonwebtoken'

export const setupRoutes = (server: Server) => {
    server.getFastify().post("/scans", async (req, res) => {
        try {
            const scanRequest = createScanRequest.parse({ ...req.body as any, user_id: req.user.sub });
            const scanId = await server.getScanService().requestScan(scanRequest);
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

    server.getFastify().get('/probes', async (req, res) => {
        return [{
            name: 'probe-nmap',
            description: 'Cette sonde va tenter d’dentifier tous les services ouverts sur le serveur cible, et de trouver des vulnérabilités connues associées à leur version.',
            type: 'Passive'
        }, {
            name: 'probe-nikto',
            description: 'Cette sonde va tenter de trouver les sous-domaines sensibles les plus connus, attachés au domaine cible.',
            type: 'Passive'
        }]
    })
}