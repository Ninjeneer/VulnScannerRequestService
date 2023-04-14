alter table "public"."reports" drop column "created_at";

alter table "public"."reports" add column "createdAt" timestamp with time zone default now();

CREATE UNIQUE INDEX "scans_lastReportId_key" ON public.scans USING btree ("lastReportId");

alter table "public"."scans" add constraint "scans_lastReportId_key" UNIQUE using index "scans_lastReportId_key";