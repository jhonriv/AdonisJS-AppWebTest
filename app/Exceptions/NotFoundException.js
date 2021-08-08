'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
   handle(error, { response }){
    return response.status(402).json({
      message:"Resource not found."
    })
  }
}

module.exports = NotFoundException
