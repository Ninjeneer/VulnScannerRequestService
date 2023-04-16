alter table "public"."scans" add column "currentReportId" uuid;

CREATE UNIQUE INDEX "scans_currentReportId_key" ON public.scans USING btree ("currentReportId");

alter table "public"."scans" add constraint "scans_currentReportId_fkey" FOREIGN KEY ("currentReportId") REFERENCES reports(id) ON DELETE CASCADE not valid;

alter table "public"."scans" validate constraint "scans_currentReportId_fkey";

alter table "public"."scans" add constraint "scans_currentReportId_key" UNIQUE using index "scans_currentReportId_key";