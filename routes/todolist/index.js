'use strict'

const S = require('fluent-json-schema')

const {
  TodoListService
} = require('./service')

const createTodoListInput = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
  }
}

const todoListSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    createdAt: { type: 'string' },
  }
}
const todoListListSchema = {
  type: 'array',
  items: todoListSchema
}

module.exports = async function (fastify, options) {
  fastify.register(require('fastify-mongodb'), {
    forceClose: true,
    url: options.MONGODB_URL,
  })

  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  fastify.addHook('onRequest', async (request, reply) => {
    const { user } = request
    const { allowedRoles } = reply.context.config
    const { roles: userRoles } = user

    request.log.info({ allowedRoles, userRoles }, 'check permission')
    const isAllowed = userRoles.some(r => allowedRoles[r])

    if (!isAllowed) {
      throw fastify.httpErrors.unauthorized()
    }
  })

  fastify.decorate('getCollection', function () {
    const db = this.mongo.db
    return db.collection('todolist')
  })

  fastify.post('/', {
    schema: {
      description: 'Create a new TodoList',
      tags: ['TodoList'],
      body: createTodoListInput,
      response: {
        200: todoListSchema
      },
      security: [
        {
          "apiKey": []
        }
      ]
    },
    config: {
      allowedRoles: { admin: true },
    }
  }, insertTodoHandler)
  
  fastify.get('/', {
    schema: {
      description: 'Return all todos',
      tags: ['TodoList'],
      response: {
        200: todoListListSchema
      },
      security: [
        {
          "apiKey": []
        }
      ]
    },
    config: {
      allowedRoles: { admin: true, reader: true },
    }
  }, listTodoHandler)
}

async function insertTodoHandler (request) {
  const { name, tags } = request.body

  const service = new TodoListService(this.getCollection(), request.log)

  const newTodo = await service.createTodo({ name, tags })
  request.log.info({ newTodo }, 'newTodo')

  return newTodo
}

async function listTodoHandler (request) {
  const service = new TodoListService(this.getCollection(), request.log)

  const todos = await service.listTodo()

  return todos
}

module.exports