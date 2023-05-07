import { UserSettings } from "../models/settings"
import supabaseClient from "./supabase"

export const getUserById = async (id: string) => {
    return (await supabaseClient.auth.admin.getUserById(id))?.data?.user
}

export const getUserSettings = async (userId: string): Promise<UserSettings> => {
    return (await supabaseClient.from('user_settings').select<string, UserSettings>('*').eq('userId', userId).maybeSingle()).data
}

export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>) => {
    await supabaseClient.from('user_settings').update(settings).eq('userId', userId)
}