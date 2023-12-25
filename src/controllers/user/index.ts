import { GenerateRefreshTokenProvider } from '../../providers/generate-refresh-token'
import { UserPrismaRepository } from '../../repositories/prisma/user'
import { UserService } from '../../services/user-service'
import { UserController } from './user-controller'

const userRepository = new UserPrismaRepository()

const generateRefreshToken = new GenerateRefreshTokenProvider()
const userService = new UserService(userRepository, generateRefreshToken)

const userController = new UserController(userService)

export { userController }
