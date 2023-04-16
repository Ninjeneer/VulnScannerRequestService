import mongoose, { Mongoose, Schema, model } from 'mongoose';
import { ProbeResult } from "../../models/probe";

const ProbeResultSchema = new Schema<ProbeResult>({
    context: {
        timestampStart: Number,
        timestampStop: Number,
        probeUid: String,
        probeName: String,
    },
    result: Schema.Types.Mixed,
});

const ProbeResultModel = mongoose.model<ProbeResult>('ProbeResult', ProbeResultSchema, 'probe_results');

export const getResultsByIds = async (ids: string[]): Promise<ProbeResult[]> => {
    return (await ProbeResultModel.find({ '_id': { $in: ids } })).map((res) => res.toObject())
}

export const getResultById = async (id: string): Promise<ProbeResult> => {
    return (await ProbeResultModel.findById(id)).toObject();
}
