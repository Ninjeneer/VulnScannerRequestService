export type ReportCreatePayload = {
    scanId: string;
    reportId?: string;
    userId: string;
    target: string
}

export type ReportUpdatePayload = Partial<ReportCreatePayload>