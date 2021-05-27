'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const fs = require('fastify-swagger')
const envSchema = require('env-schema')
const S = require('fluent-json-schema')

module.exports = async function (fastify, opts) {
  fastify.register(fs, swaggerConf)

  const config = envSchema({
    schema: schema,
    dotenv: true,
  })

  const o = Object.assign(config, opts)

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: {},
  })
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, o)
  })
}

const schema = S.object()
  .prop('MONGODB_URL', S.string().required())
  .prop('JWT_SECRET', S.string().required())

const swaggerConf = {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'auth', description: 'Auth endpoints' },
      { name: 'TodoList', description: 'TodoList endpoints' }
    ],
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  },
  uiConfig: {
    deepLinking: false
  },
  exposeRoute: true
}