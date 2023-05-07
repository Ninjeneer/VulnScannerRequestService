export type UserToken = {
  aud: string;
  exp: number;
  sub: string;
  email: string;
  phone: string;
  app_metadata: Appmetadata;
  user_metadata: Usermetadata;
  role: string;
  aal: string;
  amr: Amr[];
  session_id: string;
}

interface Amr {
  method: string;
  timestamp: number;
}

interface Usermetadata {
}

interface Appmetadata {
  provider: string;
  providers: string[];
}

export type User = {
  id: string
  email: string
}