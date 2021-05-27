'use strict'

// This file contains code that we reuse
// between our tests.

const crypto = require('crypto')

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  const uuid = crypto.randomUUID()
  return {
    MONGODB_URL: 'mongodb://localhost:27017/test-todolist-' + uuid,
    JWT_SECRET: 'secret'
  }
}

// automatically build and tear down our instance
function build (t) {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.teardown(app.close.bind(app))

  return app
}

async function getTokenForUser (t, app, { username, password }) {
  const res = await app.inject({
    url: '/auth/login',
    method: 'POST',
    payload: { username, password }
  })
  t.equal(res.statusCode, 200)
  const { token } = JSON.parse(res.payload)
  return token
}

module.exports = {
  config,
  build,
  getTokenForUser
}
