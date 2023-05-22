alter table "public"."probes" add column "price" smallint default '1'::smallint;

alter table "public"."user_credits" drop column "remaningCredits";

alter table "public"."user_credits" add column "remainingCredits" smallint default '0'::smallint;

alter table "public"."user_credits" add column "renewal" date;