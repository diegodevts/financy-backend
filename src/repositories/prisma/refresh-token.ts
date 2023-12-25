import { RefreshToken } from '@prisma/client'
import { RefreshTokenRepository } from '../refresh-token'
import { prismaClient } from '../../database/prisma-client'

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  async findById(refresh_token: string): Promise<RefreshToken | null> {
    const refreshToken = await prismaClient.refreshToken.findUnique({
      where: { id: refresh_token }
    })

    return refreshToken
  }

  async deleteMany(user_id: string): Promise<void> {
    await prismaClient.refreshToken.deleteMany({ where: { user_id } })
  }
}
