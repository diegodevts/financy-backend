import { Request, Response, Router } from 'express'
import { expenseController } from '../../controllers/expense'
import { Auth } from '../../middlewares/auth-middleware'

const endpoint = Router()
const auth = new Auth()

endpoint.post('/add', auth.execute, (request: Request, response: Response) => {
  return expenseController.add(request, response)
})

endpoint.get('/all', auth.execute, (request: Request, response: Response) => {
  return expenseController.findMany(request, response)
})

endpoint.put(
  '/update/:id',
  auth.execute,
  (request: Request, response: Response) => {
    return expenseController.update(request, response)
  }
)

endpoint.delete(
  '/remove/:id',
  auth.execute,
  (request: Request, response: Response) => {
    return expenseController.remove(request, response)
  }
)

export default endpoint
