create table "public"."user_settings" (
    "userId" uuid not null,
    "updatedAt" timestamp with time zone default now(),
    "plan" text
);


alter table "public"."user_settings" enable row level security;

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree ("userId");

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."user_settings" add constraint "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_userId_fkey";

create policy "Enable insert for user"
on "public"."user_settings"
as permissive
for insert
to authenticated
with check ((auth.uid() = "userId"));


create policy "Enable select for user"
on "public"."user_settings"
as permissive
for select
to authenticated
using ((auth.uid() = "userId"));


create policy "Enable update for user"
on "public"."user_settings"
as permissive
for update
to authenticated
using ((auth.uid() = "userId"))
with check ((auth.uid() = "userId"));