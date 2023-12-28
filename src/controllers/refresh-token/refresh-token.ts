import { Request, Response } from 'express'
import { UnauthorizedError } from '../../errors/unauthorized'
import { RefreshTokenService } from '../../services/refresh-token'

export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenService) {}

  async execute(request: Request, response: Response) {
    const { old_token } = request.params

    try {
      const { token } = await this.refreshTokenUseCase.execute(old_token)

      return response.status(200).send({ message: 'Ok', code: 200, token })
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return response.status(403).send({ message: error.message, code: 403 })
      }
    }
  }
}
