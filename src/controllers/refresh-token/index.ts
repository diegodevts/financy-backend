import { RefreshTokenService } from '../../services/refresh-token'
import { RefreshTokenController } from './refresh-token'

const refreshTokenService = new RefreshTokenService()
const refreshTokeController = new RefreshTokenController(refreshTokenService)

export { refreshTokeController }
