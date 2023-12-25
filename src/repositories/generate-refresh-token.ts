import { RefreshToken } from '@prisma/client'

export interface GenerateRefreshTokenRepository {
  execute(user_id: string): Promise<RefreshToken>
}
