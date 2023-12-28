import { Request, Response, Router } from 'express'
import { expenseController } from '../../controllers/expense'
import { Auth } from '../../middlewares/auth-middleware'
import { refreshTokeController } from '../../controllers/refresh-token'

const endpoint = Router()

endpoint.get(
  '/refresh-token/:old_token',
  (request: Request, response: Response) => {
    return refreshTokeController.execute(request, response)
  }
)

export default endpoint
