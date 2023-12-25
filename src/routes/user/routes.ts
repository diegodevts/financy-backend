import { Request, Response, Router } from 'express'
import { userController } from '../../controllers/user'
import { Auth } from '../../middlewares/auth-middleware'

const endpoint = Router()
const auth = new Auth()

endpoint.post('/register', (request: Request, response: Response) => {
  return userController.register(request, response)
})

endpoint.get('/', auth.execute, (request: Request, response: Response) => {
  return userController.find(request, response)
})

endpoint.put(
  '/update',
  auth.execute,
  (request: Request, response: Response) => {
    return userController.update(request, response)
  }
)

endpoint.post('/login', (request: Request, response: Response) => {
  return userController.login(request, response)
})

export default endpoint
