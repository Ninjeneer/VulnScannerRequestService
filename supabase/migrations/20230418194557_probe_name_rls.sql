alter table "public"."probes" add column "name" text;

create policy "Enable Select on probes of owner"
on "public"."probes"
as permissive
for select
to authenticated
using ((auth.uid() IN ( SELECT scans."userId"
   FROM scans
  WHERE (scans.id = probes."scanId"))));

alter table "public"."reports" add column "target" text;

create policy "Enable delete for users based on userId"
on "public"."scans"
as permissive
for delete
to public
using ((auth.uid() = "userId"));