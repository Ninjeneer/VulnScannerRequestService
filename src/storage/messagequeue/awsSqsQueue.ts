import IMessageQueue from "./interfaces/messageQueueInterface";
import { ProbeRequest } from "./types/probeRequest";
import AWS from 'aws-sdk';


export default class AwsSqsQueue implements IMessageQueue {
    private sqsClient: AWS.SQS;

    constructor() {
        AWS.config.update({
            region: process.env.AWS_DEFAULT_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            }
        });

        this.sqsClient = new AWS.SQS({ apiVersion: '2012-11-05' });
    }

    async publishProbeRequest(probeRequests: ProbeRequest[]): Promise<boolean> {
        const res: AWS.SQS.SendMessageBatchResult = await new Promise((resolve, reject) => {
            this.sqsClient.sendMessageBatch({
                QueueUrl: process.env.AWS_QUEUE_URL,
                Entries: probeRequests.map((probeRequest) => ({
                    Id: probeRequest.context.id,
                    MessageBody: JSON.stringify(probeRequest),
                }))
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })

        return res.Successful.length === probeRequests.length;
    }
}