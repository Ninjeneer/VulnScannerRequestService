import AWS from 'aws-sdk';
import { ProbeRequest } from '../models/probe';


AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

const sqsClient = new AWS.SQS({ apiVersion: '2012-11-05' });

export const publishProbeRequest = async (probeRequests: ProbeRequest[]): Promise<boolean> => {
    const res: AWS.SQS.SendMessageBatchResult = await new Promise((resolve, reject) => {
        sqsClient.sendMessageBatch({
            QueueUrl: process.env.AWS_QUEUE_REQUESTS_URL,
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

export const listenResultsQueue = async (onMessageResult: Function): Promise<void> => {
    console.log('[REPORT] Listening to AWS SQS Queue')
    setInterval(() => {
        sqsClient.receiveMessage({
            QueueUrl: process.env.AWS_QUEUE_RESPONSES_URL,

        }, async (err, message) => {
            if (err) {
                console.error(err)
                return
            }
            if (message?.Messages?.length > 0) {
                try {
                    message.Messages.forEach((msg) => onMessageResult(JSON.parse(msg.Body)))
                    await deleteMessagesFromQueue(message.Messages)
                } catch (e) {
                    console.error(e)
                }
            }
        })
    }, 2000)
}

export const deleteMessagesFromQueue = async (messages: AWS.SQS.Message[]): Promise<void> => {
    const res = await sqsClient.deleteMessageBatch({
        QueueUrl: process.env.AWS_QUEUE_RESPONSES_URL,
        Entries: messages.map((msg) => ({ Id: msg.MessageId, ReceiptHandle: msg.ReceiptHandle }))
    }).promise()

    if (res.Failed.length > 0) {
        throw new Error(`Failed to delete ${res.Failed.length} messages from SQS`)
    }
}
