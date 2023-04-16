export type ReportCreatePayload = {
    scanId: string;
    reportId?: string;
    userId: string;
}

export type ReportUpdatePayload = Partial<ReportCreatePayload>