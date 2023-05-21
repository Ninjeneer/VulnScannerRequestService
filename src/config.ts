export const isProd = process.env.NODE_ENV === 'production'

export const getConfig = () => {
    const commonConfig = {
        checkoutSuccessURL: process.env.CHECKOUT_SUCCESS_URL,
        checkoutCancelURL: process.env.CHECKOUT_CANCEL_URL
    }

    return isProd ? {
        ...commonConfig
    } : {
        ...commonConfig
    }
}

export const creditsPlanMapping = {
    'free': 10,
    'premium': 100,
    'enterprise': 1000
}