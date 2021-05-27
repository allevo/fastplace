'use strict'

const S = require('fluent-json-schema')
const fp = require('fastify-plugin')

const {
  AuthService
} = require('./service')

const body = S.object()
  .prop('username', S.string().required())
  .prop('password', S.string().required())

module.exports = fp(async function (fastify, options) {
  fastify.register(require('fastify-jwt'), {
    secret: options.JWT_SECRET,
  })

  fastify.post('/auth/login', {
    schema: {
      description: '**Log your user**',
      tags: ['auth'],
      summary: 'Log your user',
      body
    }
  }, loginHandler)
})

async function loginHandler (request) {
  const { body: { username, password } } = request

  const auth = new AuthService(this.jwt)

  let dto
  try {
    dto = auth.login({ username, password, reqId: request.id })
  } catch (e) {
    throw this.httpErrors.unauthorized()
  }

  return dto
}
