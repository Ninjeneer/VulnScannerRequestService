alter table "public"."probes" add column "settings" jsonb;

alter table "public"."probes_results" add column "reportId" uuid;

alter table "public"."scans" add column "lastRun" timestamp with time zone;

alter table "public"."probes_results" add constraint "probes_results_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES reports(id) ON DELETE CASCADE not valid;

alter table "public"."probes_results" validate constraint "probes_results_reportId_fkey";