alter table "public"."user_credits" drop constraint "user_credits_pkey";

drop index if exists "public"."user_credits_pkey";

alter table "public"."user_credits" drop column "id";

alter table "public"."user_credits" alter column "userId" set not null;

CREATE UNIQUE INDEX "user_credits_userId_key" ON public.user_credits USING btree ("userId");

CREATE UNIQUE INDEX user_credits_pkey ON public.user_credits USING btree ("userId");

alter table "public"."user_credits" add constraint "user_credits_pkey" PRIMARY KEY using index "user_credits_pkey";

alter table "public"."user_credits" add constraint "user_credits_userId_key" UNIQUE using index "user_credits_userId_key";