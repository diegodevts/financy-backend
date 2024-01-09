import { Request, Response, Router } from 'express'
import { Auth } from '../../middlewares/auth-middleware'
import { productController } from '../../controllers/product'

const endpoint = Router()
const auth = new Auth()

endpoint.post('/add', auth.execute, (request: Request, response: Response) => {
  return productController.addOrUpdate(request, response)
})

endpoint.get(
  '/all/:market_id',
  auth.execute,
  (request: Request, response: Response) => {
    return productController.findMany(request, response)
  }
)

export default endpoint
