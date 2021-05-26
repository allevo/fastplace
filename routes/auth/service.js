'use strict'

class AuthService {
  constructor (jwt, log) {
    this.jwt = jwt
    this.log = log
  }

  login ({ username, password, reqId }) {
    const credential = credentialDatabase[username]
    if (!credential) {
      this.log.info({ username }, 'No user found')
      throw new AuthError(AuthError.types.USER_NOT_FOUND)
    }
    if (credential.password !== password) {
      this.log.info({ username }, 'Invalid credential')
      throw new AuthError(AuthError.types.WRONG_PASSWORD)
    }

    const token = this.jwt.sign({
      roles: credential.roles,
      reqId
    }, {
      issuer: username,
      expiresIn: '7 days'
    })

    return { token }
  }
}

class AuthError extends Error {
  constructor (type) {
    super(type)
    this.name = this.constructor.name
    this.type = type
    Error.captureStackTrace(this, this.constructor)
  }
}
AuthError.types = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  WRONG_PASSWORD: 'WRONG_PASSWORD'
}

const credentialDatabase = {
  foo: {
    password: 'foo',
    roles: ['admin']
  },
  bar: {
    password: 'bar',
    roles: ['reader']
  }
}

module.exports = { AuthService, AuthError }
