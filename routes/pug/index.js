'use strict'

const path = require('path')

module.exports = async function (fastify, options) {
  
  fastify.register(require('point-of-view'), {
    engine: {
      pug: require('pug')
    },
    root: path.join(__dirname, 'view'),
  })

  fastify.get('/', (request, reply) => {
    reply.view('index.pug', { title: 'Hey', message: 'Hello GET /!' });
  })
  fastify.get('/:filepath', async (request, reply) => {
    reply.view(`${request.params.filepath}.pug`, { title: 'Hey', message: `Hello GET ${request.params.filepath}!` });
  })
  fastify.setErrorHandler((error, request, reply) => {
    if (error.code === 'ENOENT') {
      reply.view('notfound.pug');
    } else {
      reply.view('internalerror.pug');
    }
  })
}
