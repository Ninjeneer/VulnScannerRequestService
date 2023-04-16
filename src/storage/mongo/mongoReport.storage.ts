import mongoose, { Schema } from "mongoose";
import { Report } from "../../models/report";

const ReportSchema = new Schema<Report>({
    nbProbes: Number,
    target: String,
    endedAt: Number,
    totalTime: Number,
    results: Schema.Types.Mixed,
});

const ReportModel = mongoose.model<Report>('Report', ReportSchema, 'reports');

export const saveReport = async (report: Report): Promise<string> => {
    return (await new ReportModel(report).save())._id.toString()
}

export const getReportById = async (id: string): Promise<Report> => {
    return ReportModel.findById(id)
}

export const updateReport = async (reportId: string, report: Report): Promise<Report> => {
    return (await ReportModel.findByIdAndUpdate(reportId, report)).toObject()
}