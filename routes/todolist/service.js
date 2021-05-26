'use strict'

class TodoListService {
  constructor(collection, log) {
    this.collection = collection
    this.log = log
  }

  async createTodo({ name, tags }) {
    const result = await this.collection.insertOne({ name, tags, createdAt: new Date() })

    return result.ops[0]
  }
  
  async listTodo() {
    const cur = this.collection.find()
    const result = await cur.toArray()

    return result
  }
}

module.exports = { TodoListService }
