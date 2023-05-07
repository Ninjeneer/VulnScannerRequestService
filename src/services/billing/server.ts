import fastify from "fastify";
import cors from '@fastify/cors';
import { authMiddleware } from '../middlewares/authMiddleware'
import { ZodError } from 'zod'
import { config as loadLocalEnv } from "dotenv";
import { requireEnvVars } from "../../utils";
import { createCheckoutSessionRequest, webhookEventRequest } from "./validators/validateCheckoutSession";
import { createCheckoutSession, buildWebhookEvent, handleEvent } from "./billing";
import { isProd } from "../../config";
if (!isProd) {
    loadLocalEnv();
}


requireEnvVars([
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'SERVER_PORT',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'CHECKOUT_SUCCESS_URL',
    'CHECKOUT_CANCEL_URL'
])



const startServer = () => {
    const server = fastify();

    server.register(cors, {
        origin: '*'
    })
    server.listen({
        port: Number(process.env.SERVER_PORT),
        host: "0.0.0.0"
    }, () => console.info(`HTTP Server started on port ${process.env.SERVER_PORT}`))


    server.post("/checkout/sessions", { preHandler: [authMiddleware] }, async (req, res) => {
        try {
            const payload = createCheckoutSessionRequest.parse(req.body)
            const session = await createCheckoutSession(payload.priceId, req.user, payload.isUpdate)
            res.status(201).send({ redirection: session.url });
        } catch (e) {
            if (e instanceof ZodError) {
                console.warn(e)
                res.status(400).send('Invalid payload')
            } else {
                console.warn(e)
                res.status(500).send();
            }
        }
    })

    server.post('/webhook', async (req, res) => {
        let data;
        let eventType;
        // Check if webhook signing is configured.
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
        const payload = webhookEventRequest.parse(req.body)

        if (webhookSecret) {
            // Retrieve the event by verifying the signature using the raw body and secret.
            let event;
            let signature = req.headers["stripe-signature"];

            try {
                event = buildWebhookEvent(
                    payload,
                    signature,
                    webhookSecret
                );
                // Extract the object from the event.
                data = event.data;
                eventType = event.type;
            } catch (err) {
                if (isProd) {
                    console.log(`⚠️  Webhook signature verification failed.`);
                    return res.status(400).send();
                } else {
                    data = payload.data
                    eventType = payload.type
                }
            }


            try {
                handleEvent(eventType, data)
            } catch (e) {
                console.error(e)
                res.status(500).send()
            }
        }
    })
}

startServer()