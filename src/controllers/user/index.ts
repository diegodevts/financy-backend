import { UserPrismaRepository } from '../../repositories/prisma/user'
import { UserService } from '../../services/user-service'
import { UserController } from './user-controller'

const userRepository = new UserPrismaRepository()

const userService = new UserService(userRepository)

const userController = new UserController(userService)

export { userController }
