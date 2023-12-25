import { RefreshToken } from '@prisma/client'

export interface RefreshTokenRepository {
  findById(refresh_token: string): Promise<RefreshToken | null>
  deleteMany(user_id: string): Promise<void>
}
