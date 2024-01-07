import { Request, Response, Router } from 'express'
import { expenseController } from '../../controllers/expense'
import { Auth } from '../../middlewares/auth-middleware'
import { marketController } from '../../controllers/market'

const endpoint = Router()
const auth = new Auth()

endpoint.post('/add', auth.execute, (request: Request, response: Response) => {
  return marketController.add(request, response)
})

endpoint.post(
  '/add/many',
  auth.execute,
  (request: Request, response: Response) => {
    return marketController.addMany(request, response)
  }
)

endpoint.get('/all', auth.execute, (request: Request, response: Response) => {
  return marketController.findMany(request, response)
})

endpoint.put(
  '/update/:id',
  auth.execute,
  (request: Request, response: Response) => {
    return marketController.update(request, response)
  }
)

export default endpoint
