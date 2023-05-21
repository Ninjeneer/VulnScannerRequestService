import supabaseClient from "./supabase"

export const getUserCredits = async (userId: string): Promise<number> => {
    return (await supabaseClient.from('user_credits').select('remaningCredits').eq('userId', userId).maybeSingle()).data?.remaningCredits || 0
}

export const updateUserCredits = async (userId: string, remaningCredits: number): Promise<void> => {
    const res = await supabaseClient.from('user_credits').upsert({ userId, remaningCredits }).eq('userId', userId)
    if (res.error) {
        console.error(res.error)
    }
}