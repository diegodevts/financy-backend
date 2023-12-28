import { Secret, sign, decode } from 'jsonwebtoken'
import { config } from 'dotenv'
import { Token } from '../@types'

config()

export class RefreshTokenService {
  constructor() {}

  async execute(old_token: string) {
    const secret = process.env.SECRET as Secret

    const decriptedOldToken = decode(old_token)
    const { id } = decriptedOldToken as Token

    const new_token = sign({ id }, secret, {
      expiresIn: '1m'
    })

    return { token: new_token }
  }
}
