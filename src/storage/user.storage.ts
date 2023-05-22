import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { UserSettings } from "../models/settings"
import supabaseClient from "./supabase"
import { User } from "../models/user"

export const getUserById = async (id: string) => {
    return (await supabaseClient.auth.admin.getUserById(id))?.data?.user
}

export const getUserSettings = async (userId: string): Promise<UserSettings> => {
    return (await supabaseClient.from('user_settings').select<string, UserSettings>('*').eq('userId', userId).maybeSingle()).data
}

export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>) => {
    await supabaseClient.from('user_settings').update(settings).eq('userId', userId)
}

export const listenUsers = (onChange: (payload: RealtimePostgresChangesPayload<User>) => void) => {
    supabaseClient.channel('users')
        .on('postgres_changes', { event: '*', schema: 'auth', table: 'users' }, onChange)
        .subscribe()
}