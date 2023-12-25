import { PrismaRefreshTokenRepository } from '../../repositories/prisma/refresh-token'
import { RefreshTokenService } from '../../services/refresh-token'
import { RefreshTokenController } from './refresh-token'

const refreshTokenRepository = new PrismaRefreshTokenRepository()
const refreshTokenService = new RefreshTokenService(refreshTokenRepository)
const refreshTokeController = new RefreshTokenController(refreshTokenService)

export { refreshTokeController }
