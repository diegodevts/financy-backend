import { NextFunction, Request, Response } from 'express'
import { TokenExpiredError, verify } from 'jsonwebtoken'
import { UnauthorizedError } from '../errors/unauthorized'
import { Token } from '../@types'

export class Auth {
  constructor() {}

  async execute(request: Request, response: Response, next: NextFunction) {
    try {
      const { authorization } = request.headers

      if (!authorization) {
        throw new UnauthorizedError('Token inválido.')
      }

      const [_, token] = authorization.split(' ')

      const secret = process.env.SECRET as string
      const decriptedToken = verify(token, secret)
      const { id } = decriptedToken as Token

      request.body.user_id = id

      next()
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return response.status(401).json({ message: error.message })
      }

      if (error instanceof TokenExpiredError) {
        return response.status(401).json({ message: 'Token expirado.' })
      }

      return response
        .status(500)
        .send({ message: 'Internal server error.', code: 500 })
    }
  }
}
