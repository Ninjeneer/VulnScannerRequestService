import { UserCredits } from "../models/credit"
import supabaseClient from "./supabase"

export const getUserCredits = async (userId: string): Promise<number> => {
    return (await supabaseClient.from('user_credits').select('remainingCredits').eq('userId', userId).maybeSingle()).data?.remainingCredits || 0
}

export const updateUserCredits = async (userId: string, payload: Partial<UserCredits>): Promise<void> => {
    const res = await supabaseClient
        .from('user_credits')
        .upsert({ userId, ...payload }, { onConflict: 'userId' })
        .eq('userId', userId)
    if (res.error) {
        console.error(res.error)
    }
}