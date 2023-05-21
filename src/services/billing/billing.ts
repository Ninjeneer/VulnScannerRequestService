import { MissingData, UserDoesNotExist } from '../../exceptions/exceptions'
import { User } from '../../models/user'
import { updateUserCredits } from '../../storage/credits.storage'
import { getUserById, getUserSettings, updateUserSettings } from '../../storage/user.storage'
import * as billing from './DAL/stripe/stripe'
import { StripeCheckoutSessionCompleted } from './DAL/stripe/stripeTypes'

export const createCheckoutSession = async (priceId: string, user: User, isUpdate = false) => {
    const session = await billing.createCheckoutSession(priceId, user.id, user.email, isUpdate)
    return session
}

export const buildWebhookEvent = (event, signature, secret) => {
    return billing.constructEvent(event, signature, secret)
}

export const handleEvent = (eventType: string, data: any) => {
    const handlers = {
        'checkout.session.completed': handleCheckoutSession,
    }

    const handler = handlers[eventType]
    if (handler) {
        handler(data)
    }

}

const handleCheckoutSession = async (data: StripeCheckoutSessionCompleted['data']) => {
    const { userId, plan, credits } = data.object.metadata
    if (!userId) {
        throw new MissingData('userId', 'billing plan hook event')
    }
    if (!plan) {
        throw new MissingData('plan', 'billing hook event')
    }
    if (!credits) {
        throw new MissingData('credits', 'billing hook event')
    }

    const user = await getUserById(userId)
    if (!user) {
        throw new UserDoesNotExist()
    }
    console.log(`[BILLING][CHECKOUT][NEW SUB] User ${user.email} subscribed to plan ${plan}`)
    const userSettings = await getUserSettings(userId) || {}

    if (userSettings.plan !== plan) {
        // Only trigger an update if the plan has changed
        console.log(`[BILLING][CHECKOUT][NEW SUB] Updating settings of user ${user.email}...`)
        await updateUserSettings(userId, { ...userSettings, plan })
        console.log(`[BILLING][CHECKOUT][NEW SUB] Updated settings of user ${user.email}`)
    }

    // Give the user the amount of credit subscribed for
    await updateUserCredits(userId, credits)
}