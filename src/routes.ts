import { Router } from 'express'
import userRoutes from './routes/user/routes'
import expenseRoutes from './routes/expense/routes'

const routes = Router()

routes.use('/user', userRoutes)
routes.use('/expense', expenseRoutes)

export default routes
