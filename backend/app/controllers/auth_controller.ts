import type { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
// import removido, não utilizado
import { DateTime } from 'luxon'
import jwt from 'jsonwebtoken'
import ActiveDirectory from 'activedirectory2'

const JWT_SECRET = process.env.APP_KEY || 'default_secret'

export default class AuthController {
	public async login({ request, response }: HttpContext) {
		const { email, senha } = request.only(['email', 'senha'])

		// Autenticação ADMIN
		if (
			email === (process.env.ADMIN_EMAIL || '') &&
			senha === (process.env.ADMIN_SENHA || '')
		) {
			let user = await User.findBy('email', email)
			if (!user) {
				user = await User.create({
					email,
					nome: 'Administrador',
					cargo: 'Admin',
					perfil: 'ADMIN',
					ultimo_login: DateTime.now(),
				})
			} else {
				user.ultimo_login = DateTime.now()
				await user.save()
			}
			const token = jwt.sign({ id: user.id, email: user.email, nome: user.nome, perfil: user.perfil }, JWT_SECRET, { expiresIn: '1d' })
			return response.ok({ user, token })
		}

		// Autenticação LDAP
			const adConfig = {
				url: process.env.LDAP_URL || '',
				baseDN: process.env.LDAP_BASE_DN || '',
				username: process.env.LDAP_USER || '',
				password: process.env.LDAP_PASS || '',
			}
			const ad = new ActiveDirectory(adConfig)

		return new Promise((resolve) => {
			ad.authenticate(email, senha, async (err: any, auth: boolean) => {
				if (err || !auth) {
					response.unauthorized({ error: 'Credenciais inválidas' })
					return resolve(null)
				}
				// Buscar dados do usuário no AD
				ad.findUser(email, async (err: any, adUser: any) => {
					if (err || !adUser) {
						response.unauthorized({ error: 'Usuário não encontrado no AD' })
						return resolve(null)
					}
					let user = await User.findBy('email', email)
					if (!user) {
						user = await User.create({
							email,
							nome: adUser.displayName || adUser.cn || email,
							cargo: adUser.title || '',
							perfil: 'USER',
							ultimo_login: DateTime.now(),
						})
					} else {
						user.ultimo_login = DateTime.now()
						await user.save()
					}
					const token = jwt.sign({ id: user.id, email: user.email, nome: user.nome, perfil: user.perfil }, JWT_SECRET, { expiresIn: '1d' })
					response.ok({ user, token })
					return resolve(null)
				})
			})
		})
	}
}