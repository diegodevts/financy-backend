import dayjs from 'dayjs'
import { Secret, sign } from 'jsonwebtoken'
import { config } from 'dotenv'
import { RefreshTokenRepository } from '../repositories/refresh-token'
import { UnauthorizedError } from '../errors/unauthorized'

config()

export class RefreshTokenService {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  async execute(refresh_token: string) {
    const secret = process.env.SECRET as Secret
    const refreshTokenCreated = await this.refreshTokenRepository.findById(
      refresh_token
    )

    if (!refreshTokenCreated) {
      throw new UnauthorizedError('token inválido.')
    }

    const token = sign({ id: refreshTokenCreated.user_id }, secret, {
      expiresIn: '1h'
    })

    const isExpired = dayjs().isAfter(dayjs.unix(refreshTokenCreated.expiresIn))

    if (isExpired) {
      await this.refreshTokenRepository.deleteMany(refreshTokenCreated.user_id)

      const refreshToken = sign({ id: refreshTokenCreated.user_id }, secret, {
        expiresIn: '1h'
      })

      return {
        token,
        refreshToken
      }
    }

    return { token }
  }
}
