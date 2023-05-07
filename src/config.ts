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