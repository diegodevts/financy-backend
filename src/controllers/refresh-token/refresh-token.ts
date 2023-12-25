import { Request, Response } from 'express'
import { UnauthorizedError } from '../../errors/unauthorized'
import { RefreshTokenService } from '../../services/refresh-token'

export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenService) {}

  async execute(request: Request, response: Response) {
    const { id } = request.params

    try {
      const { refreshToken, token } = await this.refreshTokenUseCase.execute(id)

      return response
        .status(200)
        .send({ message: 'Ok', code: 200, refreshToken, token })
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return response.status(403).send({ message: error.message, code: 403 })
      }
    }
  }
}
