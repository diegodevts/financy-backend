import dayjs from 'dayjs'
import { RefreshToken } from '@prisma/client'
import { config } from 'dotenv'
import { GenerateRefreshTokenRepository } from '../repositories/generate-refresh-token'
import { prismaClient } from '../database/prisma-client'

config()

export class GenerateRefreshTokenProvider
  implements GenerateRefreshTokenRepository
{
  constructor() {}

  async execute(user_id: string) {
    const expiresIn = dayjs().add(1, 'hour').unix()
    const hasRefreshToken = await prismaClient.refreshToken.findFirst({
      where: { user_id }
    })

    if (hasRefreshToken) {
      await prismaClient.refreshToken.deleteMany({ where: { user_id } })
    }

    const refreshToken: RefreshToken = await prismaClient.refreshToken.create({
      data: {
        user_id,
        expiresIn
      }
    })

    return refreshToken
  }
}
