'use strict'

const { test } = require('tap')
const { build, getTokenForUser } = require('../helper')

test('todolist', async (t) => {
  const app = build(t)

  const adminToken = await getTokenForUser(t, app, { username: 'foo', password: 'foo' })
  const readerToken = await getTokenForUser(t, app, { username: 'bar', password: 'bar' })

  t.test('401 - no token provide', async t => {
    const res = await app.inject({
      url: '/todolist/',
      method: 'GET'
    })
    t.equal(res.statusCode, 401)
  })

  t.test('if you are admin', t => {
    t.test('you should access to create a todolist', async t => {
      const res = await app.inject({
        url: '/todolist/',
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + adminToken
        },
        payload: {
          name: 'my-todo-list-name',
          tags: ['tag1']
        }
      })

      t.equal(res.statusCode, 200)
      const payload = JSON.parse(res.payload)
      t.match(payload, {
        name: 'my-todo-list-name',
        tags: ['tag1']
      })
      t.ok(payload._id)
      t.ok(payload.createdAt)
      const { _id } = payload

      t.test('and fetch the items back', async t => {
        const res = await app.inject({
          url: '/todolist/',
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + adminToken
          }
        })

        t.equal(res.statusCode, 200)
        const payload = JSON.parse(res.payload)

        t.ok(payload.some(tl => tl._id === _id))
      })
    })

    t.end()
  })

  t.test('if you are reader', t => {
    t.test('you should not create a todolist', async t => {
      const res = await app.inject({
        url: '/todolist/',
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + readerToken
        },
        payload: {}
      })

      t.equal(res.statusCode, 403)
    })

    t.end()
  })
})
