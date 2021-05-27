'use strict'

const { test } = require('tap')
const { build, getTokenForUser } = require('../helper')

test('auth', async (t) => {
  const app = build(t)

  t.test('login - should return token if correct', async (t) => {
    const token = await getTokenForUser(t, app, {
      username: 'foo',
      password: 'foo'
    })
    t.ok(token)
  })

  t.test('login - ko - wrong password', async (t) => {
    const res = await app.inject({
      url: '/auth/login',
      method: 'POST',
      payload: {
        username: 'foo',
        password: 'wrongpassword'
      }
    })

    t.equal(res.statusCode, 401)

    const payload = JSON.parse(res.payload)
    t.same(payload, {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Unauthorized'
    })
  })

  t.test('login - ko - unknonw username', async (t) => {
    const res = await app.inject({
      url: '/auth/login',
      method: 'POST',
      payload: {
        username: 'unknown',
        password: 'foo'
      }
    })
    t.equal(res.statusCode, 401)
  })

  t.test('login - ko - miss password', async (t) => {
    const res = await app.inject({
      url: '/auth/login',
      method: 'POST',
      payload: {
        username: 'foo'
      }
    })

    t.equal(res.statusCode, 400)

    const payload = JSON.parse(res.payload)
    t.same(payload, {
      statusCode: 400,
      error: 'Bad Request',
      message: 'body should have required property \'password\''
    })
  })
})
