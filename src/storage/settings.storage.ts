import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import supabaseClient from './supabase'
import { UserSettings } from "../models/settings"

export const listenSettings = (onChange: (payload: RealtimePostgresChangesPayload<UserSettings>) => void) => {
    supabaseClient.channel('user_settings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_settings' }, onChange)
        .subscribe()
}