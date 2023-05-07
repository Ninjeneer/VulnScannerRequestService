import Stripe from 'stripe'
import { StripeProduct } from './stripeTypes'
import { MissingData, StripePriceDoesNotExist, StripeProductDoesNotExist } from '../../../../exceptions/exceptions'
import { getConfig } from '../../../../config'

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15'
})

export const createCheckoutSession = async (priceId: string, userId: string, userEmail: string, isUpdate = false) => {
    const price = await getPrice(priceId)
    if (!price) {
        throw new StripePriceDoesNotExist(priceId)
    }
    const product = await getProduct(price.product as string)
    if (!product) {
        throw new StripeProductDoesNotExist(price.product as string)
    }

    if (!product?.metadata?.plan) {
        throw new MissingData('plan', `Price ${priceId} metadata`)
    }
    const session = await stripeClient.checkout.sessions.create({
        customer_email: userEmail,
        metadata: {
            userId,
            userEmail,
            plan: product.metadata?.plan
        },
        mode: 'subscription',
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ],
        success_url: `${getConfig().checkoutSuccessURL}${isUpdate ? '?fromSettings=true' : ''}`,
        cancel_url: `${getConfig().checkoutCancelURL}${isUpdate ? '?fromSettings=true' : ''}`,
    })

    return session
}

export const constructEvent = (event, signature, secret) => {
    return stripeClient.webhooks.constructEvent(event, signature, secret)
}

export const getPrice = async (priceId: string): Promise<Stripe.Price> => {
    return await stripeClient.prices.retrieve(priceId)
}

export const getProduct = async (productId: string): Promise<StripeProduct> => {
    return await stripeClient.products.retrieve(productId)
}