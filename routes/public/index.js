'use strict'

const path = require('path')

module.exports = async function (fastify, options) {
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '..', '..', 'static'),
    prefix: '/'
  })
}
