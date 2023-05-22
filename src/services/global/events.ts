import {listenSettings} from '../../storage/settings.storage'
import { MissingData } from "../../exceptions/exceptions"
import { updateUserCredits } from "../../storage/credits.storage"
import { creditsPlanMapping } from "../../config"
import loadenv from 'dotenv'
import { requireEnvVars } from "../../utils"

loadenv.config()

requireEnvVars([
    'SUPABASE_URL',
	'SUPABASE_KEY',
])

export const listenEvents = () => {
    listenSettingsForFreePlanCredits()
}

const listenSettingsForFreePlanCredits = () => {
    console.log('[EVENT][SETTINGS] Listening for user settings events...')
    listenSettings(async (change) => {
        // New user has been created
        if (change.eventType === 'INSERT') {
            const { id, userId, plan } = change.new
            if (!userId) {
                throw new MissingData('userId', `user settings ${id}`)
            }
            if (!plan) {
                throw new MissingData('plan', `user settings ${id}`)
            }

            // Credits amount are handled by Stripe webhook, but we need to handle Free plan registration
            if (plan === 'free') {
                const credits = creditsPlanMapping[plan]
                await updateUserCredits(userId, { remainingCredits: credits })
                console.log(`[EVENTS][SETTINGS] Set ${credits} credits for FREE plan to ${userId}`)
            }
        }
    })
}