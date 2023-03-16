import { FastifyRequest } from "fastify"
import supabase from '../../../storage/supabase'

export const authMiddleware = async (req: FastifyRequest, res) => {
	if (req.headers.authorization) {
		try {
			const userRequest = await supabase.auth.getUser(req.headers.authorization)
			if (!userRequest.error) {
				req.user = userRequest.data.user
			} else {
				res.status(401).send()
			}
		} catch (e) {
			console.warn('Error during token check', e)
			res.status(401).send()
		}
	} else {
		res.status(401).send()
	}
}