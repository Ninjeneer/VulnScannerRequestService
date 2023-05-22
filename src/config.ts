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

export const probesPriceMapping = {
    'probe-nmap': 10,
    'probe-nikto': 2,
    'probe-dummy': 5
}

export const getAvailableProbes = () => {
    const probes = [{
		name: 'probe-nmap',
		description: 'Cette sonde va tenter d’dentifier tous les services ouverts sur le serveur cible, et de trouver des vulnérabilités connues associées à leur version.',
		type: 'Passive',
		price: probesPriceMapping['probe-nmap']
	}, {
		name: 'probe-nikto',
		description: 'Cette sonde va tenter de trouver les sous-domaines sensibles les plus connus, attachés au domaine cible.',
		type: 'Passive',
		price: probesPriceMapping['probe-nikto']
	}]

	if (!isProd) {
		probes.push({
			name: 'probe-dummy',
			description: 'Dummy probe for dev',
			type: 'Passive',
			price: probesPriceMapping['probe-dummy']
		})
	}
    return probes
}